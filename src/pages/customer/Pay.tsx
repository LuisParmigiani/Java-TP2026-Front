import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import Input from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert, AlertTitle, AlertDescription } from "../../components/Alert";
import InformationCard from "../../components/InformationCard";
import { useAuth } from "../../hooks/useAuth";
import { getPagos } from "../../services/payService";
import type { PagoResponse } from "../../services/Interfaces";
import {
  Wallet,
  History,
  CreditCard,
  Plus,
  Banknote,
  ArrowDownCircle,
  Upload,
} from "lucide-react";
import { getUser } from "../../services/ClientService";
import { Link } from "react-router-dom";
import { Helmet } from "../../components/Helmet";

type Tab = "mercadopago" | "comprobante";

const METODO_ICONS: Record<string, React.ReactNode> = {
  "Mercado Pago": <CreditCard className="w-4 h-4 text-blue-500" />,
  Comprobante: <Upload className="w-4 h-4 text-purple-500" />,
  Efectivo: <Banknote className="w-4 h-4 text-green-500" />,
  Transferencia: <ArrowDownCircle className="w-4 h-4 text-blue-500" />,
};

export default function Pay() {
  const { token } = useAuth();
  const [saldo, setSaldo] = useState<number>(0);
  const [precioUltPedidoSem, setPrecioUltPedidoSem] = useState<number>(0);
  const [pagos, setPagos] = useState<PagoResponse[]>([]);
  const [tab, setTab] = useState<Tab>("mercadopago");
  const [amount, setAmount] = useState("");
  const [comprobante, setComprobante] = useState<FileList | null>(null);
  const [alert, setAlert] = useState<"success" | "danger" | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPagos(token);
        setPagos(response);
        const response2 = await getUser(token, ["persona"]);
        setSaldo(response2.persona.saldo);
        setPrecioUltPedidoSem(response2.precioPedidosSemanales ?? 0);
      } catch (e) {
        console.error("Error cargando datos de saldo:", e);
      } finally {
        setFetchLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  const handleMercadoPago = () => {
    const monto = parseFloat(amount);
    if (!monto || monto <= 0) return;
    console.log("Mercado Pago - monto:", monto);
    // TODO: integrar con API de Mercado Pago
  };

  const handleComprobante = () => {
    if (!comprobante || comprobante.length === 0) return;
    console.log("Comprobante a subir:", comprobante[0]);
    // TODO: subir comprobante al servidor
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const isValidAmount = amount !== "" && parseFloat(amount) > 0;
  const isValidComprobante = comprobante !== null && comprobante.length > 0;
  const { currentUser, isAuthenticated } = useAuth();

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
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      {alert && (
        <div className="px-4 pt-4 max-w-4xl mx-auto w-full">
          <Alert
            variant={alert === "success" ? "success" : "danger"}
            autoClose
            onClose={() => setAlert(null)}
          >
            <AlertTitle>
              {alert === "success"
                ? "¡Saldo cargado con éxito!"
                : "¡Error al cargar el saldo!"}
            </AlertTitle>
            <AlertDescription>
              {alert === "success"
                ? "El monto fue acreditado a tu cuenta correctamente."
                : "Ocurrió un error. Por favor intentá de nuevo más tarde."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cargar Saldo</h1>
          <p className="text-gray-500 mt-1">
            Recargá tu cuenta para pagar tus pedidos fácilmente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InformationCard
            miniTitle="Saldo disponible"
            title={
              fetchLoading
                ? "..."
                : new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }).format(saldo)
            }
            description={
              saldo < 0
                ? "Poseés una deuda pendiente de pago."
                : saldo >= precioUltPedidoSem && precioUltPedidoSem > 0
                  ? "Tu saldo cubre tu próximo pedido semanal."
                  : "Tu saldo no alcanza para tu próximo pedido semanal."
            }
            cardColor={
              saldo < 0
                ? "redCard"
                : saldo >= precioUltPedidoSem && precioUltPedidoSem > 0
                  ? "greenCard"
                  : "yellowCard"
            }
            titleColor="white"
            descriptionColor="white"
            size="md"
            svg={<Wallet className="w-5 h-5 text-white" />}
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-800">
                Nueva recarga
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setTab("mercadopago")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-200 ${tab === "mercadopago" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                <CreditCard className="w-4 h-4" />
                Mercado Pago
              </button>
              <button
                onClick={() => setTab("comprobante")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors duration-200 ${tab === "comprobante" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                <Upload className="w-4 h-4" />
                Comprobante
              </button>
            </div>

            {tab === "mercadopago" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Monto a cargar
                  </label>
                  <Input
                    name="monto"
                    type="number"
                    placeholder="Ej: 500"
                    value={amount}
                    onChange={(v) => typeof v === "string" && setAmount(v)}
                    color="primary"
                    size="full"
                  />
                </div>
                <Button
                  variant="primary"
                  size="full"
                  onClick={handleMercadoPago}
                  disabled={!isValidAmount}
                >
                  <Plus className="w-4 h-4" />
                  Cargar saldo
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Subir comprobante
                  </label>
                  <Input
                    name="comprobante"
                    type="file"
                    onChange={(v) => v instanceof FileList && setComprobante(v)}
                    color="primary"
                    size="full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG o PDF. Máx 10MB.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="full"
                  onClick={handleComprobante}
                  disabled={!isValidComprobante}
                >
                  <Upload className="w-4 h-4" />
                  Subir comprobante
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-800">
              Historial de recargas
            </h2>
            {pagos.length > 0 && (
              <span className="ml-auto text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {pagos.length} {pagos.length === 1 ? "recarga" : "recargas"}
              </span>
            )}
          </div>

          {fetchLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : pagos.length === 0 ? (
            <div className="text-center py-10">
              <Wallet className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                No tenés recargas registradas todavía.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pagos.map((pago) => (
                <div
                  key={pago.id}
                  className="flex items-center justify-between py-3 hover:bg-gray-50/60 -mx-2 px-2 rounded-lg transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                      {METODO_ICONS[pago.metodoPago] ?? (
                        <Banknote className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {pago.metodoPago}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(pago.fecha)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    +{formatCurrency(pago.monto)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
