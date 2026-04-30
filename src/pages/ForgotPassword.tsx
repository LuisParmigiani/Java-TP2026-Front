import { Link } from "react-router-dom";
import Footer from "../components/Footer.tsx";
import Navbar from "../components/NavBar.tsx";
import { AuthCard } from "../components/AuthCard.tsx";
import { FormField } from "../components/FormField.tsx";
import { Button } from "../components/Button.tsx";
import { resetPassword } from "../services/authService.ts";
import { CodeInput } from "../components/CodeInput";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const navigate = useNavigate();
  // Estado que guarda los segundos restantes para reintentar (cronómetro)
  const [timer, setTimer] = useState(0);
  // Estado que guarda el id del intervalo para poder detenerlo luego
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Este useEffect se encarga de limpiar el intervalo cuando el componente se desmonta
  // o cuando cambia el intervalId, para evitar que el cronómetro siga corriendo en segundo plano
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId); // Limpia el intervalo si existe. función de JS para limpiar intervalo
    };
  }, [intervalId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email)
      newErrors.email = "Ingresa un formato válido de correo electrónico";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email: formData.email });
      setSuccess(true);
      setTimer(120); // Inicia el cronómetro en 120 segundos (2 minutos)
      // Crea un intervalo que se ejecuta cada 1 segundo
      const id = setInterval(() => {
        setTimer((prev) => {
          // Si el tiempo llega a 0 o menos, detiene el intervalo
          if (prev <= 1) {
            clearInterval(id); // Detiene el cronómetro
            return 0;
          }
          // Si no, resta 1 segundo
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id); // Guarda el id del intervalo para poder limpiarlo después
    } catch (error) {
      setLoading(false);
      const status = error.status;
      if (status === 401) {
        toast.error("No se encontró la cuenta con ese correo electrónico", {
          duration: 1000,
        });
      } else if (
        error instanceof Error &&
        error.message &&
        error.message.toLowerCase().includes("network")
      ) {
        toast.error("No se pudo conectar con el servidor", { duration: 1000 });
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error al restablecer la contraseña",
          { duration: 1000 },
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-muted/30">
        <AuthCard
          title={success ? "Correo enviado" : "Recuperar contraseña"}
          description={
            success ? (
              <>
                <span className="font-medium">
                  Ya te enviamos un correo electrónico con las instrucciones a
                  seguir para reestablecer tu contraseña.
                </span>
                <br />
                <span className="font-medium">
                  No olvides revisar la bandeja de spam.
                </span>
                <br />
                <br />
                <span className="block">
                  Ingresa por favor el código que te enviamos por mail:
                </span>
              </>
            ) : (
              "Ingresa el correo electrónico asociado a tu cuenta donde te enviaremos las instrucciones para restablecer tu contraseña"
            )
          }
          bottomText={
            success ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="text-sm">¿No recibiste el código?</span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={timer > 0}
                    className={`text-sm font-medium ${timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-primary hover:underline cursor-pointer"}`}
                  >
                    Volver a enviar
                  </button>
                  {timer > 0 && (
                    <span className="text-xs text-gray-500 min-w-8 text-center">
                      {timer}s
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600">
                ¿Recordaste tu contraseña?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            )
          }
        >
          {!success ? (
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
              <Button
                variant="primary"
                type="submit"
                className="w-full h-11 text-base mt-2"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCodeError("");
                // Aquí deberías validar el código con el backend
                if (code.length < 6) {
                  setCodeError("El código debe tener 6 caracteres");
                  return;
                }
                // Simulación de éxito
                if (code === "123456") {
                  navigate("/validate-code");
                } else {
                  setCodeError("Código incorrecto");
                }
              }}
              className="flex flex-col gap-4 mt-4"
            >
              <CodeInput
                value={code}
                onChange={(val) => {
                  setCode(val);
                  if (codeError) setCodeError("");
                }}
                length={6}
                error={!!codeError}
              />
              {codeError && (
                <div className="text-red-500 text-center text-sm">
                  {codeError}
                </div>
              )}
              <Button
                variant="primary"
                type="submit"
                className="w-full h-11 text-base mt-2"
                disabled={code.length < 6}
              >
                Validar código
              </Button>
            </form>
          )}
        </AuthCard>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
