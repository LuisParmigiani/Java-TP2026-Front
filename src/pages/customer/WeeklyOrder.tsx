import { Button } from "../../components/Button";
import Filter from "../../components/Filter";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import { getAllByUserId } from "../../services/DirectionService";
import { useAuth } from "../../hooks/useAuth";
import ProductTable from "../../components/ProductTable";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import { Helmet } from "../../components/Helmet";

export default function WeeklyOrder() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("Nombre A-Z");
  const [state, setState] = useState("Mostrar Todas");
  const [actualSearchTerm, setActualSearchTerm] = useState("");
  const [lineasPedido, setLineasPedido] = useState([]);
  const [directions, setDirections] = useState([]);
  const [directionSelected, setDirectionSelected] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const { token } = useAuth();
  const size = 10;
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const handleSearch = () => {
    setActualSearchTerm(searchTerm);
    setPage(1);
  };

  useEffect(() => {
    if (!token) return;
    const adresSearch = async () => {
      try {
        const response = await getAllByUserId(
          token,
          state,
          undefined,
          orderBy,
          actualSearchTerm,
          "Habilitados",
          ["pedidoSemanal", "productoZona", "producto"],
          page - 1,
          size,
        );
        setDirections(response.content);
        setTotalItems(response.totalElements);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };
    adresSearch();
  }, [token, state, orderBy, actualSearchTerm, page]);

  const description = (id: number) => () => {
    const direction = directions.find((dir) => dir.id === id);
    if (direction) {
      if (
        direction.pedidosSemanales &&
        Array.isArray(direction.pedidosSemanales)
      ) {
        const nuevasLineas = direction.pedidosSemanales
          .map((linea) => {
            const subtotal =
              linea.cantidad * linea.productoZona.producto.precio;
            if (linea.cantidad === 0) {
              return null; // Omitir esta línea si la cantidad es 0
            }
            return {
              productoZona: {
                producto: {
                  nombre: linea.productoZona.producto.nombre,
                  precio: linea.productoZona.producto.precio,
                },
              },
              cantidad: linea.cantidad,
              subtotal: subtotal,
            };
          })
          .filter(
            (linea): linea is NonNullable<typeof linea> => linea !== null,
          );

        setLineasPedido(nuevasLineas);
        setShowDescription(true);
      }
      setDirectionSelected(direction);
    } else {
      alert("Dirección no encontrada.");
    }
  };
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
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-6">
      <NavBar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex-1 ">
        <h1 className="text-2xl font-semibold mb-6 tracking-tight">
          Pedido Semanal
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 ">
          <div className="flex flex-row gap-2">
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
              name={state}
              options={["Mostrar Todas", "Activas", "Inactivas"]}
              onSave={(value) => {
                setState(value);
                setPage(1);
              }}
              color="primary"
              size="md"
            />
          </div>
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
        {showDescription && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setShowDescription(false)}
          >
            <div
              className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Detalle del pedido semanal
                  </h2>
                  <p>
                    Direccion: {directionSelected?.calle}, Número:{" "}
                    {directionSelected?.numero}{" "}
                    {directionSelected?.casa
                      ? `Casa: ${directionSelected.casa}`
                      : ""}
                  </p>
                </div>
                <button
                  onClick={() => setShowDescription(false)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar
                </button>
              </div>
              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                <p className="mb-4 text-sm font-semibold text-gray-700">
                  Resumen del pedido
                </p>
                <ProductTable
                  lineasPedido={lineasPedido}
                  total={lineasPedido
                    .filter(
                      (linea): linea is NonNullable<typeof linea> =>
                        linea !== null,
                    )
                    .reduce((acc, linea) => acc + linea.subtotal, 0)}
                />
                <div className="mx-auto mt-4 w-full max-w-3xl text-center text-sm text-gray-500">
                  <Button
                    color="primary"
                    size="md"
                    onClick={() =>
                      navigate("/customer/editWeeklyOrder", {
                        state: { domicilioId: directionSelected?.id },
                      })
                    }
                  >
                    Editar Pedido Semanal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
          {directions.map((direction) => (
            <div key={direction.id} className="h-full">
              <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col h-full transition-colors hover:border-primary/60">
                <h2 className="text-base font-medium mb-2 text-gray-900">
                  Pedido Semanal
                </h2>
                <div className="mb-3 flex-1">
                  <p className="text-xs text-gray-500 font-medium">Dirección</p>
                  <p className="text-sm mt-1 text-gray-700">
                    Calle: {direction.calle}, Número: {direction.numero}{" "}
                    {direction?.casa ? `Casa: ${direction.casa}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="w-full border border-primary text-primary bg-transparent hover:bg-primary/10 transition-colors"
                  onClick={description(direction.id)}
                >
                  Ver Pedido Semanal
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          page={page}
          totalPerPage={size}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </main>
      <Footer />
    </div>
  );
}
