import { useEffect, useState } from "react";
import DireccionCard from "../../components/DirectionCard";
import Footer from "../../components/Footer";
import Filter from "../../components/Filter";
import type { DomicilioResponse } from "../../services/Interfaces";
import { getAllByUserId, postDirection } from "../../services/DirectionService";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/Button";
import type { DomicilioRequest } from "../../services/Interfaces";
import NewDirection from "../../components/NewDirection";
import Input from "../../components/Input";
import Pagination from "../../components/Pagination";
import { Alert, AlertTitle, AlertDescription } from "../../components/Alert";
import { Link } from "react-router-dom";
import { Helmet } from "../../components/Helmet";

export default function Directions() {
  const [directions, setDirections] = useState<DomicilioResponse[]>([]);
  const [filter, setFilter] = useState({ status: "", deliveryDay: "" });
  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<
    "created" | "edited" | "false" | null
  >(null);
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("Nombre A-Z");
  const [enabledStatus, setEnabledStatus] = useState("Todos");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const size = 5;
  const { token } = useAuth();

  const hasActiveFilters =
    (filter.status !== "" && filter.status !== "Mostrar Todas") ||
    appliedSearchTerm !== "" ||
    enabledStatus !== "Todos";

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setPage(1);
  };

  const handleSaveNewDirection = (direction: DomicilioRequest) => {
    const save = async () => {
      try {
        const result = await postDirection(direction, token);
        setDirections((current) => [...current, result]);
        setShowSuccessAlert("created");
      } catch (error) {
        setShowSuccessAlert(null);
        setError((error as Error).message || 'Error al crear la dirección');
      }
      setOpen(false);
    };
    save();
  };

  useEffect(() => {
    if (!token) return;
    const fetchDirections = async () => {
      try {
        const result = await getAllByUserId(
          token,
          filter.status,
          null,
          orderBy,
          appliedSearchTerm,
          enabledStatus,
          ["diaDomicilio"],
          page - 1,
          size,
        );
        console.log(result.content);
        setDirections(result.content);
        setTotalItems(result.totalElements);
        console.log(result);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };
    fetchDirections();
  }, [filter, token, orderBy, appliedSearchTerm, page, enabledStatus]);
  const handleSaveDirection = (updatedDirection: DomicilioResponse) => {
    setDirections((current) =>
      current.map((direction) =>
        direction.id === updatedDirection.id ? updatedDirection : direction,
      ),
    );
    setShowSuccessAlert("edited");
  };
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  const { currentUser, isAuthenticated, loading } = useAuth();

  if (loading) {
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
  return (
    <>
      <NavBar />
      {open && (
        <NewDirection
          close={() => setOpen(false)}
          setDirection={handleSaveNewDirection}
        />
      )}
      <div className="p-4 sm:p-6 lg:p-8 gap-4 felx flex-col">
        {showSuccessAlert && (
          <Alert
            variant={showSuccessAlert === "false" ? "danger" : "success"}
            autoClose={true}
            onClose={() => setShowSuccessAlert(null)}
          >
            <AlertTitle>
              {showSuccessAlert === "created"
                ? "¡Dirección creada correctamente!"
                : showSuccessAlert === "false"
                  ? "Error al crear la dirección"
                  : "¡Dirección actualizada correctamente!"}
            </AlertTitle>
            <AlertDescription>
              {showSuccessAlert === "created"
                ? "Tu nueva dirección fue agregada. Estará desactivada hasta que el administrador la habilite."
                : showSuccessAlert === "false"
                  ? error ||
                    "Ocurrió un error al guardar tu dirección. Por favor, intenta nuevamente."
                  : "Los cambios en tu dirección fueron guardados exitosamente."}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-row justify-between ">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Direcciones
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Aquí puedes gestionar tus direcciones de entrega.
            </p>
          </div>
          <Button
            color="primary"
            size="md"
            onClick={() => setOpen(!open)}
            className="px-4"
          >
            Agregar Dirección
          </Button>
        </div>
        <div className="flex flex-row mt-5 gap-2">
          <Filter
            name={filter.status || "Estado"}
            options={["Mostrar Todas", "Activas", "Inactivas"]}
            onSave={(value) => {
              setFilter({ ...filter, status: value });
              setPage(1);
            }}
            color="primary"
            size="md"
          />
          <Filter
            name={orderBy}
            options={["Nombre A-Z", "Nombre Z-A"]}
            onSave={(value) => {
              setOrderBy(value);
              setPage(1);
            }}
            color="primary"
            size="md"
          />
          <Filter
            name={enabledStatus}
            options={[
              "Todos",
              "Habilitados",
              "Pendientes de aprobacion",
              "Rechazados",
            ]}
            onSave={(value) => {
              setEnabledStatus(value);
              setPage(1);
            }}
            color="primary"
            size="md"
          />
          <div className="flex gap-2 flex-1 justify-end items-center ">
            <Input
              placeholder="Buscar producto..."
              color="primary"
              size="md"
              name="Buscar producto"
              type="text"
              onChange={(value) => {
                if (typeof value === "string") {
                  setSearchTerm(value);
                }
              }}
              value={searchTerm}
            />
            <Button
              color="primary"
              size="md"
              onClick={handleSearch}
              className="px-4"
            >
              Buscar
            </Button>
          </div>
        </div>
        <div className="mt-6 space-y-4 mb-10">
          <div className="flex flex-col gap-6">
            {directions.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                <p className="text-sm text-gray-500">
                  {hasActiveFilters
                    ? "No se encontraron direcciones con los filtros aplicados."
                    : "No tenés direcciones cargadas. Agregá una dirección para verla aquí."}
                </p>
              </div>
            ) : (
              directions.map((direction) => (
                <DireccionCard
                  direction={direction}
                  onSave={handleSaveDirection}
                />
              ))
            )}
          </div>
        </div>
        <Pagination
          page={page}
          totalPerPage={size}
          totalItems={totalItems}
          onPageChange={setPage}
        />
        <Footer />
      </div>
    </>
  );
}
