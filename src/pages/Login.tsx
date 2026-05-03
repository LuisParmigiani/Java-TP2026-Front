import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button.tsx";
import { AuthCard } from "../components/AuthCard.tsx";
import { FormField } from "../components/FormField.tsx";
import { toast } from "sonner";
import Footer from "../components/Footer.tsx";
import Navbar from "../components/NavBar.tsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const authLogin = useAuth().login;
  const authLogout = useAuth().logout;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) newErrors.email = "El correo es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    return newErrors;
  };

  useEffect(() => {
    authLogout();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // ✅ Usar authLogin del contexto
      await authLogin(formData.email, formData.password, rememberMe);
      toast.success("Inicio de sesión exitoso", { duration: 1000 });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setLoading(false);
      const status = error.status;
      if (status === 401) {
        toast.error("Credenciales inválidas", { duration: 1000 });
      } else if (
        error instanceof Error &&
        error.message &&
        error.message.toLowerCase().includes("network")
      ) {
        toast.error("No se pudo conectar con el servidor", { duration: 1000 });
      } else {
        toast.error(
          error instanceof Error ? error.message : "Error al iniciar sesión",
          { duration: 1000 },
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-muted/30">
        <AuthCard
          title="Bienvenido de nuevo"
          description="Ingresa tus credenciales para acceder a tu cuenta"
          bottomText={
            <>
              <p className="text-center text-sm mb-2">
                <Link
                  to="/forgot-password"
                  className="text-primary font-medium hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
              <p className="text-center text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="tu@email.com"
            />
            <div className="relative">
              <FormField
                label="Contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  // Ojo abierto
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // Ojo tachado
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.423 6.423A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 pl-1">
              <input
                id="savePassword"
                type="checkbox"
                className="accent-primary w-4 h-4 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="savePassword"
                className="text-sm select-none cursor-pointer"
              >
                Recordar mi contraseña
              </label>
            </div>
            <Button
              variant="primary"
              type="submit"
              className="w-full h-11 text-base mt-2"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </AuthCard>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
