# Sistema de Autenticación y Autorización

## 📋 Descripción General

El sistema de autenticación está dividido en dos archivos para optimizar el **Fast Refresh** de Vite:

- **`authContext.ts`** - Contexto y tipos (sin lógica)
- **`AuthContext.tsx`** - Componente proveedor con lógica

## 🏗️ Estructura de Archivos

### 1. `authContext.ts` - Definición del Contexto

```typescript
// Solo tipos e instancia del contexto
export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
```

**Responsabilidades:**

- Define la interfaz `AuthContextType` con toda la información de autenticación
- Define el `AuthContext` que será consumido por otros componentes
- Define el tipo `User` con el campo `role` para control de permisos

### 2. `AuthContext.tsx` - Proveedor (Provider)

```typescript
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ← IMPORTANTE

   useEffect(() => {
    const storedToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false); // ← IMPORTANTE: Solo después de cargar el usuario. Para que funcionen las rutas protegidas
  }, []);

  const login = async (email: string, password: string) => {
    // Llama a authService.login()
    // Guarda token y usuario en localStorage
    // Actualiza el estado
  };

  const logout = () => {
    // Limpia estado y localStorage
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Responsabilidades:**

- Maneja el estado de autenticación
- Implementa `login()` y `logout()`
- Persiste datos en `localStorage`
- Restaura sesión al montar

## 🔑 Roles Soportados

El sistema soporta **4 roles**:

```typescript
type Role = "Administrador" | "Empleado" | "Usuario" | "Driver";
```

| Rol             | Descripción          | Permisos                         |
| --------------- | -------------------- | -------------------------------- |
| `Administrador` | Administrador        | Acceso total al sistema          |
| `Usuario`       | Cliente              | Compra de productos, ver pedidos |
| `Empleado`      | Empleado             | Similar a driver                 |
| `Driver`        | Conductor/Repartidor | Gestión de rutas y entregas      |

## 🔐 Validación de Roles y Permisos

### 1. Hook `useAuth()`

Ubicado en `src/hooks/useAuth.ts`:

```typescript
import { useAuth } from "../hooks/useAuth";

const MyComponent = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // Acceder a información del usuario
  console.log(currentUser?.role); // 'Administrador' | 'Driver' | 'Usuario'
};
```

### 2. Ejemplo: Validar Rol en Componente

```typescript
import { useAuth } from '../hooks/useAuth';

const AdminPanel = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // Verificar si el usuario es admin
  if (!isAuthenticated || currentUser?.role !== 'Administrador') {
    return <div>Acceso denegado. Solo administradores.</div>;
  }

  return (
    <div>
      <h1>Panel de Administración</h1>
      {/* Contenido solo para admins */}
    </div>
  );
};
```

### 3. Ejemplo: Componente ProtectedRoute

Crea un componente reutilizable para proteger rutas:

```typescript
// src/contexts/ProtectedRoute.tsx
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  // Espera a que el contexto termine de cargar antes de validar
  //El uso de loading en el contexto de autenticación es fundamental para evitar que las rutas protegidas se validen o rendericen antes de que el usuario esté correctamente cargado desde el storage. Así se previenen flashes de contenido no autorizado y validaciones incorrectas.
  if (loading) return null; // O un loader/spinner si prefieres

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser?.role!)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
```

**Uso en App.tsx:**

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* Rutas protegidas para clientes */}
  <Route element={<ProtectedRoute allowedRoles={["Usuario"]} />}>
    <Route path="/customer/dashboard" element={<Dashboard />} />
    <Route path="/customer/orders" element={<Orders />} />
    <Route path="/customer/newOrder" element={<NewOrder />} />
    <Route path="/customer/directions" element={<Directions />} />
  </Route>

  {/* Rutas protegidas para admins */}
  <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/products" element={<ProductsManagement />} />
  </Route>
</Routes>
```

---

## Información nueva:

Ahora para que la información no se pueda adulterar solo nos regimos por el token, es decir, authContext tiene un useEffect que utiliza servicios de authService para validar y decodear el token cada vez que este cambia y con esa data seteamos los estados del contexto que usamos en toda la página.

Antes, se apiBaseClient tomaba el token de uno de los 2 storage (session/local) y lo agregaba al header si es que había. Ahora este token ya no nos sirve del todo porque no se valida su firma (puede estar modificado), entonces lo que hacemos es tomar del contexto la variable token (ya validada como mencionamos anteriormente) y pasarla como parámetro a cada servicio que haga una petición en el back para poder incluirlo en el Header; ya sea para usar el idUsuario dentro o validar autenticación/roles en el back.

## Por qué esto de enviarlo siempre?

Porque el baseApiClient no puede tomar esta variable token validada del contexto porque se encuentra fuera del componente AuthProvider. Además no modifica en nada poner a todos los servicios y componentes esta nueva variable como parámetro ya que los endpoints se siguen comportando igual (no cambian las rutas) y si es NULO este token y no es necesario (porque tal vez sea un endpoint público, que hasta ahora no tenemos) al llamar a la variable del estado token, esta retorna null y cuando se envía como parámetro al servicio llega null y no se agrega el token al header.

**Resumen de cambios que van a notar:** Llamadas a servicios desde los componentes (que a su vez llaman a los servicios básicos derivados del ApiFetch) va el token como parámetro, no se asusten, no llega como parámetro al back pq se agrega en el header. Que ahora en context hay un useEffect que cada vez que el token se adultera, se llama al back para validar su firma y traer nuevamente los datos a los estados de React.

---

### 4. Ejemplo: Ocultar/Mostrar Contenido por Rol

En la **NavBar**, el sistema ya implementa esto:

```typescript
const Header = () => {
  const { isAuthenticated } = useAuth();
  const { isAdmin, isCustomer, isDriver } = usePermission();

  // Arrays de rutas por rol
  const publicLinks = [...];     // Visible para todos
  const customerLinks = [...];   // Solo clientes
  const driverLinks = [...];     // Solo conductores
  const adminLinks = [...];      // Solo admins

  const getNavLinks = () => {
    if (!isAuthenticated) return publicLinks;
    if (isAdmin()) return adminLinks;
    if (isDriver()) return driverLinks;
    if (isCustomer()) return customerLinks;
    return publicLinks;
  };

  return (
    <header>
      {/* Renderiza diferentes links según rol */}
      {getNavLinks().map((link) => (
        <Link key={link.path} to={link.path}>
          {link.label}
        </Link>
      ))}
    </header>
  );
};
```

### 5. Ejemplo: Hook Personalizado para Permisos (lo hice más simplificado para evitar redundancia. Solo que devuelva roles).

Crea un hook reutilizable para verificar permisos:

```typescript
// src/hooks/usePermission.ts
import { useAuth } from "./useAuth";

export const usePermission = () => {
  const { currentUser } = useAuth();

  const isAdmin = () => currentUser?.role === "Administrador";
  const isDriver = () => currentUser?.role === "Conductor";
  const isCustomer = () => currentUser?.role === "Usuario";
  const isEmployee = () => currentUser?.role === "Empleado";

  return {
    isAdmin,
    isDriver,
    isCustomer,
    isEmployee,
  };
};
```

**Uso:**

```typescript
import { usePermission } from '../hooks/usePermission';

const MyComponent = () => {
  const { isAdmin, isEmployee } = usePermission();

  return (
    <div>
      {isAdmin() && <button>Eliminar Usuario</button>}

      {isEmployee()) && (
        <button>Ver Mi Perfil</button>
      )}
    </div>
  );
};
```

## 🔄 Flujo de Autenticación

```
┌─────────────────────────────────────────┐
│ Usuario ingresa email y contraseña      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ authService.login(email, password)      │
│ (llama al backend /auth/login)          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ AuthContext.login()                     │
│ - Guarda token en local/sessionStorage
│ - Guarda currentUser con la info del token validado     (api/verify-token) y decodificado en estado                    │
│ - Actualiza estado isAuthenticated
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Componentes acceden vía useAuth()       │
│ - Leen token y currentUser de estados del contexto
│ - Validan rol en rutas/componentes      │
└─────────────────────────────────────────┘
```

## 💾 Persistencia

Cuando el usuario se autentica, dos datos se guardan en `localStorage`:

```typescript
// Guardado en AuthContext.tsx
localStorage.setItem("authToken", token); // Token JWT
localStorage.setItem("currentUser", JSON.stringify(user)); // Datos del usuario
```

Al recargar la página, `AuthProvider` restaura automáticamente la sesión:

```typescript
useEffect(() => {
  const storedToken = localStorage.getItem("authToken");

  //Algo así
  if (storedToken) {
    verifyToken(token)
      .then(() => {
        // Decodifica localmente después de validar con el backend
        const decoded = decodeToken(token);
        setCurrentUser({
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          username: decoded.username,
        });
        setIsAuthenticated(true);
  }
}, []);
```

## 📝 Checklist de Configuración

- [x] `authContext.ts` define tipos y contexto
- [x] `AuthContext.tsx` implementa provider
- [x] `useAuth()` hook en `src/hooks/useAuth.ts`
- [x] `AuthProvider` envuelve la app en `App.tsx`
- [x] Crear `ProtectedRoute` componente (ver ejemplo arriba)
- [x] Del 4 para abajo en el documento, modificar para implementar el uso de solamente el token
- [x] Crear `usePermission` hook (ver ejemplo arriba)
- [x] Validar que el backend retorna `role` en login
- [x] Testar logout y redirección a login

## 🐛 Troubleshooting

**Error: "useAuth debe usarse dentro de AuthProvider"**

- Verifica que `<AuthProvider>` envuelve tu app en `App.tsx`

**Fast Refresh no funciona**

- Asegúrate que `AuthContext.tsx` solo exporta el componente
- Los tipos deben estar en `authContext.ts`

**Usuario no persiste al recargar**

- Verifica que `localStorage` está habilitado
- Comprueba que el `useEffect` en `AuthProvider` se ejecuta
- Abre DevTools → Application → Local Storage

## 📚 Referencias

- [React Context API](https://react.dev/reference/react/useContext)
- [React Router Protected Routes](https://reactrouter.com/en/main)
- [localStorage API](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
