import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import InformationCard from "../../components/InformationCard";
import type { UserResponse, UserRequest } from "../../services/Interfaces.ts";
import { getUser, UpdateUserAPersona } from "../../services/ClientService.ts";
import { useAuth } from "../../hooks/useAuth";
import {
  User,
  Mail,
  Phone,
  FileText,
  Edit3,
  Save,
  X,
  Wallet,
  Shield,
  Loader,
} from "lucide-react";
import InfoRow from "../../components/InfoRow.tsx";
import { Link } from "react-router-dom";
import { Helmet } from "../../components/Helmet.tsx";
import { toast } from "sonner";

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoDoc: string;
  nroDocumento: string;
  nombreUsuario: string;
  precioUltPedidoSem: number;
  password: string;
}

const DocOption = [
  { value: "DNI", label: "DNI" },
  { value: "Cédula", label: "Cédula" },
  { value: "Pasaporte", label: "Pasaporte" },
];

const profileSchema = z.object({
  nombreUsuario: z
    .string()
    .min(
      3,
      "El nombre de usuario debe tener al menos 3 caracteres y solo puede contener letras, números y guiones bajos.",
    )
    .regex(
      /^[a-zA-Z0-9_]{3,}$/,
      "El nombre de usuario debe tener al menos 3 caracteres y solo puede contener letras, números y guiones bajos.",
    ),
  email: z
    .string()
    .regex(
      /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "El mail debe ser válido",
    ),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          val,
        ),
      {
        message:
          "La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial",
      },
    ),
  tipoDoc: z
    .string()
    .regex(
      /^(DNI|Pasaporte|Cédula)$/,
      "El tipo de documento debe ser DNI, Pasaporte o Cédula",
    ),
  nroDocumento: z
    .string()
    .regex(
      /^\d{7,10}$/,
      "El número de documento debe tener entre 7 y 10 dígitos",
    ),
  nombre: z
    .string()
    .min(3, "El nombre debe tener entre 3 y 50 caracteres")
    .max(50, "El nombre debe tener entre 3 y 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{3,50}$/,
      "El nombre solo puede contener letras y espacios",
    ),
  apellido: z
    .string()
    .min(3, "El apellido debe tener entre 3 y 50 caracteres")
    .max(50, "El apellido debe tener entre 3 y 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{3,50}$/,
      "El apellido solo puede contener letras y espacios",
    ),
  telefono: z.string().regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  precioUltPedidoSem: z.number(),
});

const UserLevel = {
  Administrador: "bg-red-100 text-red-700 border border-red-200",
  Empleado: "bg-blue-100 text-blue-700 border border-blue-200",
  Usuario: "bg-primary/10 text-primary border border-primary/20",
  Conductor: "bg-amber-100 text-amber-700 border border-amber-200",
};

export default function Profile() {
  const {
    token,
    currentUser,
    isAuthenticated,
    setUserProfilePic,
    updateCurrentUsername,
    loading: authLoading,
  } = useAuth();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [editing, setEditing] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [imageLoadError, setImageLoadError] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    tipoDoc: "",
    nroDocumento: "",
    nombreUsuario: "",
    precioUltPedidoSem: 0,
    password: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getUser(token, ["persona"]);
        setUser(response);
        setProfilePreview("");
        setImageLoadError(false); // Reset error cuando se fetch usuario // Limpiar preview local para sincronizar con backend

        setFormData({
          nombre: response.persona?.nombre ?? "",
          apellido: response.persona?.apellido ?? "",
          email: response.persona?.email ?? "",
          telefono: response.persona?.telefono ?? "",
          tipoDoc: response.persona?.tipoDoc ?? "",
          nroDocumento: response.persona?.nroDocumento ?? "",
          nombreUsuario: response.nombreUsuario ?? "",
          precioUltPedidoSem: response.precioPedidosSemanales ?? 0,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetchLoading(false);
      }
    }
    if (token) fetchUserData();
  }, [token]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser || currentUser.role !== "Usuario") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Helmet>
          <title>Acceso Denegado - Sodas Rojas</title>
          <meta
            name="description"
            content="Acceso denegado al panel de administración"
          />
        </Helmet>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-lg mb-6">
            No tienes permiso para acceder a esta página.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }
  const handleCancel = () => {
    if (user) {
      setFormData({
        nombre: user.persona?.nombre ?? "",
        apellido: user.persona?.apellido ?? "",
        email: user.persona?.email ?? "",
        telefono: user.persona?.telefono ?? "",
        tipoDoc: user.persona?.tipoDoc ?? "",
        nroDocumento: user.persona?.nroDocumento ?? "",
        nombreUsuario: user.nombreUsuario ?? "",
        precioUltPedidoSem: user.precioPedidosSemanales ?? 0,
        password: "",
      });
    }
    setSelectedFile(null);
    setProfilePreview("");
    setEditing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageLoadError(false); // Reset error cuando se selecciona archivo. para que si cloudinary no devuelve foto usemos SR
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  const handleSave = async () => {
    // Validar con Zod
    const result = profileSchema.safeParse(formData);

    const errors: Partial<Record<keyof FormData, string>> = {};
    let hasErrors = false;

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        errors[field] = err.message;
      });
      hasErrors = true;
    }

    if (changePassword) {
      if (!formData.password) {
        errors.password = "Debe ingresar una nueva contraseña";
        hasErrors = true;
      } else if (formData.password !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden");
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({});
      setPasswordError(null);
    }

    const toastId = toast.loading("Actualizando datos...");
    try {
      setUploading(true);
      const payload: UserRequest = {
        nombreUsuario: formData.nombreUsuario,
        persona: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          tipoDoc: formData.tipoDoc,
          nroDocumento: formData.nroDocumento,
        },
      };

      if (changePassword && formData.password) {
        (payload as any).contrasena = formData.password;
      }

      const response = await UpdateUserAPersona(
        token,
        payload,
        selectedFile || undefined,
        ["persona"],
      );
      setUser(response);

      // Update global context username to reflect changes in navbar immediately
      if (response.nombreUsuario) {
        updateCurrentUsername(response.nombreUsuario);
      }

      if (response.imagenUrl) {
        setUserProfilePic(response.imagenUrl);
      }
      setSelectedFile(null);
      setProfilePreview("");
      setImageLoadError(false);
      setChangePassword(false);
      setConfirmPassword("");
      setFormData((prev) => ({ ...prev, password: "" }));

      toast.success("Datos actualizados correctamente", { id: toastId });
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error al actualizar los datos", { id: toastId });
    } finally {
      setUploading(false);
      setEditing(false);
    }
  };

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const saldo = user?.persona?.saldo ?? 0;
  const nivelAcceso = user?.nivelAcceso ?? "";
  const badgeClass =
    UserLevel[nivelAcceso] ??
    "bg-gray-100 text-gray-700 border border-gray-200";

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="grow container mx-auto px-4 py-8 max-w-4xl flex flex-col gap-4">
          <div className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="grow container mx-auto px-4 py-8 max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative group">
              {editing ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shrink-0 shadow-md overflow-hidden hover:opacity-75 transition disabled:opacity-50 cursor-pointer"
                >
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.imagenUrl && !imageLoadError ? (
                    <img
                      src={user.imagenUrl + "?t=" + Date.now()} //esto es para que pida la foto nueva a cloudinary y no use la de la cache
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold tracking-tight">
                      SR
                    </span>
                  )}
                </button>
              ) : (
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.imagenUrl && !imageLoadError ? (
                    <img
                      src={user.imagenUrl + "?t=" + Date.now()} //para que no use la de la cache y la pida
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold tracking-tight">
                      SR
                    </span>
                  )}
                </div>
              )}
              {editing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.nombre || formData.apellido
                    ? `${formData.nombre} ${formData.apellido}`.trim()
                    : user?.nombreUsuario}
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  @{formData.nombreUsuario}
                </p>
                {nivelAcceso && (
                  <span
                    className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}
                  >
                    <Shield className="w-3 h-3" />
                    {nivelAcceso}
                  </span>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                {!editing ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setEditing(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar perfil
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleCancel}
                      disabled={uploading}
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSave}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Guardar
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información personal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-gray-800">
                Información Personal
              </h2>
            </div>

            {editing ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={update("nombre")}
                    error={formErrors.nombre}
                  />
                  <FormField
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={update("apellido")}
                    error={formErrors.apellido}
                  />
                </div>
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={update("email")}
                  error={formErrors.email}
                />
                <FormField
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={update("telefono")}
                  error={formErrors.telefono}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Tipo de Doc."
                    name="tipoDoc"
                    type="select"
                    value={formData.tipoDoc}
                    onChange={update("tipoDoc")}
                    options={DocOption}
                    error={formErrors.tipoDoc}
                  />
                  <FormField
                    label="Nro. Documento"
                    name="nroDocumento"
                    value={formData.nroDocumento}
                    onChange={update("nroDocumento")}
                    error={formErrors.nroDocumento}
                  />
                </div>
              </div>
            ) : (
              <div>
                <InfoRow
                  icon={<User className="w-4 h-4 text-primary" />}
                  label="Nombre completo"
                  value={`${formData.nombre} ${formData.apellido}`.trim()}
                />
                <InfoRow
                  icon={<Mail className="w-4 h-4 text-primary" />}
                  label="Email"
                  value={formData.email}
                />
                <InfoRow
                  icon={<Phone className="w-4 h-4 text-primary" />}
                  label="Teléfono"
                  value={formData.telefono}
                />
                <InfoRow
                  icon={<FileText className="w-4 h-4 text-primary" />}
                  label="Documento"
                  value={`${formData.tipoDoc} ${formData.nroDocumento}`.trim()}
                />
              </div>
            )}
          </div>

          {/* Cuenta + Saldo */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold text-gray-800">
                  Mi Cuenta
                </h2>
              </div>

              {editing ? (
                <div className="flex flex-col gap-4">
                  <FormField
                    label="Nombre de usuario"
                    name="nombreUsuario"
                    value={formData.nombreUsuario}
                    onChange={update("nombreUsuario")}
                    error={formErrors.nombreUsuario}
                  />

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (changePassword) {
                          setFormData((prev) => ({ ...prev, password: "" }));
                          setConfirmPassword("");
                          setPasswordError(null);
                          setFormErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                        setChangePassword((s) => !s);
                      }}
                      className="text-sm font-medium"
                    >
                      {changePassword
                        ? "Cancelar cambio de contraseña"
                        : "Cambiar contraseña"}
                    </Button>

                    {changePassword && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative">
                          <FormField
                            label="Contraseña"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="*******"
                            value={formData.password}
                            onChange={update("password")}
                            error={formErrors.password}
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
                          label="Repetir contraseña"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="*******"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    )}

                    {passwordError && (
                      <p className="text-sm text-red-500 mt-2">
                        {passwordError}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <InfoRow
                    icon={<User className="w-4 h-4 text-primary" />}
                    label="Usuario"
                    value={formData.nombreUsuario}
                  />
                  <InfoRow
                    icon={<Mail className="w-4 h-4 text-primary" />}
                    label="Email de acceso"
                    value={formData.email}
                  />
                  <InfoRow
                    icon={<Shield className="w-4 h-4 text-primary" />}
                    label="Contraseña"
                    value="********"
                  />
                </div>
              )}
            </div>

            <InformationCard
              miniTitle="Saldo disponible"
              title={new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(saldo)}
              description={
                saldo < 0
                  ? "Poseés una deuda pendiente de pago."
                  : saldo >= formData.precioUltPedidoSem &&
                      formData.precioUltPedidoSem > 0
                    ? "Tu saldo cubre tu próximo pedido semanal."
                    : saldo === 0 && formData.precioUltPedidoSem === 0
                      ? "Tu saldo está al día y no tienes pedidos pendientes."
                      : "Tu saldo no alcanza para tu próximo pedido semanal."
              }
              cardColor={
                saldo < 0
                  ? "redCard"
                  : (saldo >= formData.precioUltPedidoSem &&
                        formData.precioUltPedidoSem > 0) ||
                      (saldo === 0 && formData.precioUltPedidoSem === 0)
                    ? "greenCard"
                    : "yellowCard"
              }
              titleColor="white"
              descriptionColor="white"
              size="md"
              svg={<Wallet className="w-5 h-5 text-white" />}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
