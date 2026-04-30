import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button.tsx";
import { AuthCard } from "../components/AuthCard.tsx";
import { FormField } from "../components/FormField.tsx";
import { toast } from "sonner";
import Footer from "../components/Footer.tsx";
import NavBar from "../components/NavBar.tsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [formData, setFormData] = useState({
    persona_tipoDoc: "",
    persona_nroDoc: "",
    persona_nombre: "",
    persona_apellido: "",
    persona_telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    usuario_nombre: "",
    usuario_nivelAcceso: "Usuario",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    persona_tipoDoc?: string;
    persona_nroDoc?: string;
    persona_nombre?: string;
    persona_apellido?: string;
    persona_telefono?: string;
    usuario_nombre?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validación por etapa
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (step === 1) {
      if (!formData.persona_tipoDoc)
        newErrors.persona_tipoDoc = "El tipo de documento es requerido";
      if (!formData.persona_nroDoc)
        newErrors.persona_nroDoc = "El número de documento es requerido";
      else if (!/^\d{7,10}$/.test(formData.persona_nroDoc)) {
        newErrors.persona_nroDoc =
          "El número de documento debe tener entre 7 y 10 dígitos";
      }
      if (!formData.persona_nombre)
        newErrors.persona_nombre = "El nombre es requerido";
      else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{3,50}$/.test(formData.persona_nombre)) {
        newErrors.persona_nombre = "El nombre debe tener entre 3 y 50 letras";
      }
      if (!formData.persona_apellido)
        newErrors.persona_apellido = "El apellido es requerido";
      else if (
        !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{3,50}$/.test(formData.persona_apellido)
      ) {
        newErrors.persona_apellido =
          "El apellido debe tener entre 3 y 50 letras";
      }
      if (!formData.persona_telefono)
        newErrors.persona_telefono = "El teléfono es requerido";
      else if (!/^\d{10}$/.test(formData.persona_telefono)) {
        newErrors.persona_telefono = "El teléfono debe tener 10 dígitos";
      }
    } else if (step === 2) {
      if (!formData.email) newErrors.email = "El correo es requerido";
      else if (
        !/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
      ) {
        newErrors.email = "El email debe ser válido";
      }
      if (!formData.password) newErrors.password = "La contraseña es requerida";
      else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          formData.password,
        )
      ) {
        newErrors.password =
          "La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial";
      }
      if (!formData.usuario_nombre)
        newErrors.usuario_nombre = "El nombre de usuario es requerido";
      else if (!/^[a-zA-Z0-9_]{3,}$/.test(formData.usuario_nombre)) {
        newErrors.usuario_nombre =
          "El nombre de usuario debe tener al menos 3 caracteres y solo puede contener letras, números y guiones bajos.";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Debes repetir la contraseña";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }
    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
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
      await authRegister(
        formData.email,
        formData.password,
        formData.persona_tipoDoc,
        formData.persona_nroDoc,
        formData.persona_nombre,
        formData.persona_apellido,
        formData.persona_telefono,
        formData.usuario_nombre,
        formData.usuario_nivelAcceso,
      );

      toast.success(
        "Registro exitoso. Ahora inicie sesión para acceder a su cuenta nueva",
        { duration: 2000 },
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setLoading(false);
      const status = (error as any).status;
      if (status === 500) {
        toast.error("Error interno del servidor", { duration: 1000 });
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
            : "Error al registrar la cuenta",
          { duration: 1000 },
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-muted/30">
        <AuthCard
          title="Bienvenido"
          description="Ingresa tus datos para crear tu cuenta y formar parte de nuestra comunidad"
          bottomText={
            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          }
        >
          {/* Títulos de etapas */}
          <div className="flex items-center mb-6 justify-center">
            <button
              type="button"
              className={`text-lg font-bold px-4 py-2 rounded-t transition-colors duration-200 focus:outline-none ${
                step === 1
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400"
              }`}
              onClick={() => {
                // Si ya está en la etapa 1, no hace nada
                if (step === 1) return;
                setStep(1);
              }}
            >
              Datos Personales
            </button>
            <span className="mx-2 text-gray-300">|</span>
            <button
              type="button"
              className={`text-lg font-bold px-4 py-2 rounded-t transition-colors duration-200 focus:outline-none ${
                step === 2
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400"
              }`}
              onClick={() => {
                // Si ya está en la etapa 2, no hace nada
                if (step === 2) return;
                // Validar antes de avanzar
                const newErrors = validate();
                if (Object.keys(newErrors).length > 0) {
                  setErrors(newErrors);
                  return;
                }
                setStep(2);
              }}
            >
              Datos de Cuenta Usuario
            </button>
          </div>

          <form
            onSubmit={step === 1 ? handleNext : handleSubmit}
            className="space-y-5"
          >
            {step === 1 ? (
              <>
                <FormField
                  label="Tipo de Documento"
                  name="persona_tipoDoc"
                  type="select"
                  value={formData.persona_tipoDoc}
                  onChange={handleChange}
                  error={errors.persona_tipoDoc}
                  options={[
                    { value: "DNI", label: "DNI" },
                    { value: "Cédula", label: "Cédula" },
                    { value: "Pasaporte", label: "Pasaporte" },
                  ]}
                  required
                />
                <FormField
                  label="Número de Documento"
                  name="persona_nroDoc"
                  type="text"
                  value={formData.persona_nroDoc}
                  onChange={handleChange}
                  error={errors.persona_nroDoc}
                  placeholder="12345678"
                  required
                />
                <FormField
                  label="Nombre"
                  name="persona_nombre"
                  type="text"
                  value={formData.persona_nombre}
                  onChange={handleChange}
                  error={errors.persona_nombre}
                  placeholder="Juan"
                  required
                />
                <FormField
                  label="Apellido"
                  name="persona_apellido"
                  type="text"
                  value={formData.persona_apellido}
                  onChange={handleChange}
                  error={errors.persona_apellido}
                  placeholder="Pérez"
                  required
                />
                <FormField
                  label="Teléfono"
                  name="persona_telefono"
                  type="text"
                  value={formData.persona_telefono}
                  onChange={handleChange}
                  error={errors.persona_telefono}
                  placeholder="1123456789"
                  required
                />
              </>
            ) : (
              <>
                <FormField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="tu@email.com"
                  required
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
                    required
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
                <FormField
                  label="Repetir Contraseña"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  required
                />
                <FormField
                  label="Nombre de Usuario"
                  name="usuario_nombre"
                  type="text"
                  value={formData.usuario_nombre}
                  onChange={handleChange}
                  error={errors.usuario_nombre}
                  placeholder="jperez_123"
                  required
                />
              </>
            )}

            {/* Botones dinámicos */}
            <div className="flex justify-between">
              {step === 1 ? (
                <>
                  <Button
                    type="button"
                    variant="grayTransparent"
                    onClick={() => navigate("/login")}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" type="button" onClick={handleNext}>
                    Siguiente
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="grayTransparent"
                    onClick={handleBack}
                  >
                    Volver
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Registrando usuario ..." : "Registrarse"}
                  </Button>
                </>
              )}
            </div>
          </form>
          <br></br>
        </AuthCard>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
