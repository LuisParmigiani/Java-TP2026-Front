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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
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

  const login = async (email: string, password: string) => {
    // Llama a authService.login()
    // Guarda token y usuario en localStorage
    // Actualiza el estado
  };

  const logout = () => {
    // Limpia estado y localStorage
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, token, login, logout }}>
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
type Role = 'admin' | 'driver' | 'customer' | 'employee';
```

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `admin` | Administrador | Acceso total al sistema |
| `driver` | Conductor/Repartidor | Gestión de rutas y entregas |
| `customer` | Cliente | Compra de productos, ver pedidos |
| `employee` | Empleado | Similar a driver |

## 🔐 Validación de Roles y Permisos

### 1. Hook `useAuth()`

Ubicado en `src/hooks/useAuth.ts`:

```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Acceder a información del usuario
  console.log(currentUser?.role); // 'admin' | 'driver' | 'customer'
};
```

### 2. Ejemplo: Validar Rol en Componente

```typescript
import { useAuth } from '../hooks/useAuth';

const AdminPanel = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // Verificar si el usuario es admin
  if (!isAuthenticated || currentUser?.role !== 'admin') {
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
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser, isAuthenticated } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está permitido, redirigir a home
  if (!allowedRoles.includes(currentUser?.role!)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

**Uso en App.tsx:**

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  
  {/* Rutas protegidas para clientes */}
  <Route
    path="/customer/dashboard"
    element={
      <ProtectedRoute allowedRoles={['customer']}>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  
  {/* Rutas protegidas para drivers/empleados */}
  <Route
    path="/driver/dashboard"
    element={
      <ProtectedRoute allowedRoles={['driver', 'employee']}>
        <DriverDashboard />
      </ProtectedRoute>
    }
  />
  
  {/* Rutas solo para admins */}
  <Route
    path="/admin/dashboard"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

### 4. Ejemplo: Ocultar/Mostrar Contenido por Rol

En la **NavBar**, el sistema ya implementa esto:

```typescript
const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();

  // Arrays de rutas por rol
  const publicLinks = [...];     // Visible para todos
  const customerLinks = [...];   // Solo clientes
  const driverLinks = [...];     // Solo conductores
  const adminLinks = [...];      // Solo admins

  const getNavLinks = () => {
    if (!isAuthenticated) return publicLinks;
    if (currentUser?.role === 'admin') return adminLinks;
    if (currentUser?.role === 'driver') return driverLinks;
    if (currentUser?.role === 'customer') return customerLinks;
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

### 5. Ejemplo: Hook Personalizado para Permisos

Crea un hook reutilizable para verificar permisos:

```typescript
// src/hooks/usePermission.ts
import { useAuth } from './useAuth';

export const usePermission = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const hasRole = (role: string | string[]) => {
    if (!isAuthenticated) return false;
    
    const allowedRoles = Array.isArray(role) ? role : [role];
    return allowedRoles.includes(currentUser?.role!);
  };

  const isAdmin = () => currentUser?.role === 'admin';
  const isDriver = () => 
    currentUser?.role === 'driver' || currentUser?.role === 'employee';
  const isCustomer = () => currentUser?.role === 'customer';

  return {
    hasRole,
    isAdmin,
    isDriver,
    isCustomer,
    currentRole: currentUser?.role,
  };
};
```

**Uso:**

```typescript
import { usePermission } from '../hooks/usePermission';

const MyComponent = () => {
  const { hasRole, isAdmin } = usePermission();

  return (
    <div>
      {isAdmin() && <button>Eliminar Usuario</button>}
      
      {hasRole(['customer', 'driver']) && (
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
│ - Guarda token en localStorage          │
│ - Guarda usuario en localStorage        │
│ - Actualiza estado                      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Componentes acceden vía useAuth()       │
│ - Leen token y usuario del contexto     │
│ - Validan rol en rutas/componentes      │
└─────────────────────────────────────────┘
```

## 💾 Persistencia

Cuando el usuario se autentica, dos datos se guardan en `localStorage`:

```typescript
// Guardado en AuthContext.tsx
localStorage.setItem('authToken', token);           // Token JWT
localStorage.setItem('currentUser', JSON.stringify(user)); // Datos del usuario
```

Al recargar la página, `AuthProvider` restaura automáticamente la sesión:

```typescript
useEffect(() => {
  const storedToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('currentUser');
  
  if (storedToken && storedUser) {
    setToken(storedToken);
    setCurrentUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
  }
}, []);
```

## 📝 Checklist de Configuración

- [x] `authContext.ts` define tipos y contexto
- [x] `AuthContext.tsx` implementa provider
- [x] `useAuth()` hook en `src/hooks/useAuth.ts`
- [x] `AuthProvider` envuelve la app en `App.tsx`
- [ ] Crear `ProtectedRoute` componente (ver ejemplo arriba)
- [ ] Crear `usePermission` hook (ver ejemplo arriba)
- [ ] Validar que el backend retorna `role` en login
- [ ] Testar logout y redirección a login

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
