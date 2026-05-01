import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword, verifyResetToken } from "../services/authService";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import { AuthCard } from "../components/AuthCard";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [valid, setValid] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [, setError] = useState("");

  // Handler para los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validación simple
  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password,
      )
    ) {
      newErrors.password =
        "Debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo";
    }
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Debes repetir la contraseña";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await resetPassword({ token: token, nuevaPassword: formData.password });
    } catch (error) {
      toast.error("Error al restablecer la contraseña");
    }
    toast.success("Contraseña restablecida correctamente");
    setTimeout(() => navigate("/login"), 1500);
  };

  useEffect(() => {
    if (!token) {
      setValid(false);
      setLoading(false);
      return;
    }
    verifyResetToken({ token })
      .then(() => {
        setValid(true);
      })
      .catch((err) => {
        setValid(false);
        setError(err.message || "Token inválido o expirado");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-primary mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span className="text-lg text-primary">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <AuthCard
            title="Token inválido"
            description={
              "Por favor, realiza un nuevo pedido para restablecer tu contraseña."
            }
          >
            <Button
              variant="primary"
              onClick={() => navigate("/forgot-password")}
            >
              Volver a solicitar
            </Button>
          </AuthCard>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-muted/30">
        <AuthCard
          title="Restablecer contraseña"
          description="Ingresa tu nueva contraseña."
        >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <FormField
                label="Nueva contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
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
            <FormField
              label="Repetir nueva contraseña"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
            />
            <Button variant="primary" type="submit">
              Restablecer contraseña
            </Button>
          </form>
        </AuthCard>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
