import { Helmet } from "../../components/Helmet";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import InformationCard from "../../components/InformationCard";
import {
  CreditCard,
  Wallet,
  History,
  Plus,
  Truck,
  Users,
  Zap,
  MoreHorizontal,
} from "lucide-react";
import Input from "../../components/Input";
import { Button } from "../../components/Button";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/Select";
import { fetchTrucks } from "../../services/TruckService";
import { fetchPersonas } from "../../services/PersonaService";
import type {
  CamionResponse,
  PersonaResponse,
  GastoRequest,
  GastoResponse,
} from "../../services/Interfaces";
import { getAll, postExpense } from "../../services/ExpensesService";
import Pagination from "../../components/Pagination";
import { useAuth } from "../../hooks/useAuth";

type TabType = "camion" | "sueldo" | "servicios" | "otros";

const SERVICIOS = [
  "Luz",
  "Gas",
  "Agua",
  "Internet",
  "Alquiler",
  "Teléfono",
  "Seguro",
  "Mantenimiento",
];

const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: "camion", label: "Camión", icon: <Truck className="w-4 h-4" /> },
  { key: "sueldo", label: "Sueldo", icon: <Users className="w-4 h-4" /> },
  { key: "servicios", label: "Servicios", icon: <Zap className="w-4 h-4" /> },
  {
    key: "otros",
    label: "Otros",
    icon: <MoreHorizontal className="w-4 h-4" />,
  },
];

function gastoIcon(g: GastoResponse) {
  if (g.camionId) return <Truck className="w-4 h-4 text-primary" />;
  if (g.detalle?.startsWith("Sueldo -"))
    return <Users className="w-4 h-4 text-primary" />;
  const esServicio = SERVICIOS.some((s) => g.detalle === s);
  if (esServicio) return <Zap className="w-4 h-4 text-primary" />;
  return <MoreHorizontal className="w-4 h-4 text-primary" />;
}

export default function Expenses() {
  const [activeTab, setActiveTab] = useState<TabType>("camion");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  // Camión
  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [camionDetalle, setCamionDetalle] = useState("");

  // Sueldo
  const [selectedEmpleado, setSelectedEmpleado] = useState("");

  // Servicios
  const [selectedServicio, setSelectedServicio] = useState("");

  // Otros
  const [otrosDetalle, setOtrosDetalle] = useState("");

  const [trucks, setTrucks] = useState<CamionResponse[]>([]);
  const [personas, setPersonas] = useState<PersonaResponse[]>([]);
  const [gastos, setGastos] = useState<GastoResponse[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { token } = useAuth();
  const pageSize = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        const trucksData = await fetchTrucks(token);
        const personasData = await fetchPersonas(token, 0, 1000000000);
        setTrucks(trucksData);
        setPersonas(personasData.content);
        console.log("Trucks loaded:", trucksData);
        console.log("Personas loaded:", personasData.content);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadGastos = async () => {
      setFetchLoading(true);
      try {
        const data = await getAll(page - 1, pageSize);
        setGastos(data.content);
        setTotalItems(data.totalElements);
      } catch (error) {
        console.log("Error fetching gastos:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    loadGastos();
  }, [page]);

  const isFormValid = () => {
    if (!monto || parseFloat(monto) <= 0) return false;
    switch (activeTab) {
      case "camion":
        return !!selectedTruckId;
      case "sueldo":
        return !!selectedEmpleado;
      case "servicios":
        return !!selectedServicio;
      case "otros":
        return !!otrosDetalle.trim();
    }
  };

  const handleSubmit = async () => {
    const base: GastoRequest = {
      monto: parseFloat(monto),
      fecha,
    };

    let gasto: GastoRequest;
    switch (activeTab) {
      case "camion":
        gasto = {
          ...base,
          detalle: camionDetalle,
          camion_id: parseInt(selectedTruckId),
        };
        break;
      case "sueldo":
        gasto = { ...base, detalle: `Sueldo - ${selectedEmpleado}` };
        break;
      case "servicios":
        gasto = { ...base, detalle: selectedServicio };
        break;
      case "otros":
        gasto = { ...base, detalle: otrosDetalle };
        break;
    }

    console.log("Submitting gasto:", gasto);
    // TODO: llamar al servicio para guardar el gasto
    const response = await postExpense(gasto);
    console.log("Gasto registrado:", response);
    setPage(1);
    // reset form
    setMonto("");
    setFecha(new Date().toISOString().split("T")[0]);
    setSelectedTruckId("");
    setCamionDetalle("");
    setSelectedEmpleado("");
    setSelectedServicio("");
    setOtrosDetalle("");
  };

  const totalGastosMes = gastos.reduce((sum, g) => sum + g.monto, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Helmet>
        <title>Gestion de gastos - Sodas Rojas</title>
        <meta name="description" content="Panel de control administrativo" />
      </Helmet>
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Gastos
          </h1>
          <p className="text-gray-500 mt-1">
            Registrá los gastos de la empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InformationCard
            miniTitle="Resumen del mes"
            title={"Gastos del mes: $" + totalGastosMes.toLocaleString()}
            description="Esto son todos los gastos que se han realizado este mes, incluyendo compras de insumos, mantenimiento de camiones, sueldos, entre otros."
            cardColor="primary"
            titleColor="white"
            descriptionColor="white"
            size="md"
            svg={<Wallet className="w-5 h-5 text-white" />}
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-800">
                Nuevo gasto
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 font-medium transition-colors duration-200 ${
                    activeTab === tab.key
                      ? "bg-primary text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Contenido del tab */}
            {activeTab === "camion" && (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Camión
                  </label>
                  <Select
                    value={selectedTruckId}
                    onValueChange={setSelectedTruckId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar patente" />
                    </SelectTrigger>
                    <SelectContent>
                      {trucks.map((truck) => (
                        <SelectItem key={truck.id} value={truck.id.toString()}>
                          {truck.patente} — {truck.marca} {truck.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Detalle
                  </label>
                  <Input
                    name="camionDetalle"
                    type="text"
                    placeholder="Ej: Reparación de frenos"
                    value={camionDetalle}
                    onChange={(v) =>
                      typeof v === "string" && setCamionDetalle(v)
                    }
                    color="primary"
                    size="full"
                  />
                </div>
              </div>
            )}

            {activeTab === "sueldo" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Empleado
                </label>
                <Select
                  value={selectedEmpleado}
                  onValueChange={setSelectedEmpleado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((p) => (
                      <SelectItem
                        key={p.id}
                        value={`${p.nombre} ${p.apellido}`}
                      >
                        {p.nombre} {p.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "servicios" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Servicio
                </label>
                <Select
                  value={selectedServicio}
                  onValueChange={setSelectedServicio}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICIOS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "otros" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Descripción
                </label>
                <Input
                  name="otrosDetalle"
                  type="text"
                  placeholder="Ej: Compra de materiales de limpieza"
                  value={otrosDetalle}
                  onChange={(v) => typeof v === "string" && setOtrosDetalle(v)}
                  color="primary"
                  size="full"
                />
              </div>
            )}

            {/* Monto y fecha comunes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Monto
                </label>
                <Input
                  name="monto"
                  type="number"
                  placeholder="Ej: 5000"
                  value={monto}
                  onChange={(v) => typeof v === "string" && setMonto(v)}
                  color="primary"
                  size="full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Fecha
                </label>
                <Input
                  name="fecha"
                  type="date"
                  placeholder=""
                  value={fecha}
                  onChange={(v) => typeof v === "string" && setFecha(v)}
                  color="primary"
                  size="full"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="full"
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              <Plus className="w-4 h-4" />
              Registrar gasto
            </Button>
          </div>
        </div>

        {/* Historial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-800">
              Historial de gastos
            </h2>
            <span className="ml-auto text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Gastos del mes actual
            </span>
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
          ) : gastos.length === 0 ? (
            <div className="text-center py-10">
              <Wallet className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                No hay gastos registrados todavía.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-50">
                {gastos.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {gastoIcon(g)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {g.detalle}
                        </p>
                        <p className="text-xs text-gray-400">{g.fecha}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-red-500">
                      -${g.monto.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <Pagination
                page={page}
                totalPerPage={pageSize}
                totalItems={totalItems}
                onPageChange={setPage}
                className="border-t border-gray-100 mt-2"
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
