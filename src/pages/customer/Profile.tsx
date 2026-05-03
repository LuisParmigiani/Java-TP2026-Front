import { useEffect, useState, useRef } from "react";
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

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoDoc: string;
  nroDocumento: string;
  nombreUsuario: string;
  precioUltPedidoSem: number;
}

const DocOption = [
  { value: "DNI", label: "DNI" },
  { value: "Cédula", label: "Cédula" },
  { value: "Pasaporte", label: "Pasaporte" },
];

const UserLevel = {
  Administrador: "bg-red-100 text-red-700 border border-red-200",
  Empleado: "bg-blue-100 text-blue-700 border border-blue-200",
  Usuario: "bg-primary/10 text-primary border border-primary/20",
  Conductor: "bg-amber-100 text-amber-700 border border-amber-200",
};

export default function Profile() {
  const { token, currentUser, isAuthenticated, setUserProfilePic } = useAuth();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [editing, setEditing] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [imageLoadError, setImageLoadError] = useState(false);
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
  });

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
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetchLoading(false);
      }
    }
    if (token) fetchUserData();
  }, [token]);

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
      const response = await UpdateUserAPersona(
        token,
        payload,
        selectedFile || undefined,
        ["persona"],
      );
      setUser(response);
      if (response.imagenUrl) {
        setUserProfilePic(response.imagenUrl);
      }
      setSelectedFile(null);
      setProfilePreview("");
      setImageLoadError(false); // Reset error después de guardar
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setUploading(false);
      setEditing(false);
    }
  };

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
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
                  />
                  <FormField
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={update("apellido")}
                  />
                </div>
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={update("email")}
                />
                <FormField
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={update("telefono")}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Tipo de Doc."
                    name="tipoDoc"
                    type="select"
                    value={formData.tipoDoc}
                    onChange={update("tipoDoc")}
                    options={DocOption}
                  />
                  <FormField
                    label="Nro. Documento"
                    name="nroDocumento"
                    value={formData.nroDocumento}
                    onChange={update("nroDocumento")}
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
                <FormField
                  label="Nombre de usuario"
                  name="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={update("nombreUsuario")}
                />
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
                    : "Tu saldo no alcanza para tu próximo pedido semanal."
              }
              cardColor={
                saldo < 0
                  ? "redCard"
                  : saldo >= formData.precioUltPedidoSem &&
                      formData.precioUltPedidoSem > 0
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
