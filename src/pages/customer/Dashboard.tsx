import { useEffect, useState } from "react";
import DireccionCard from "../../components/DirectionCard";
import Footer from "../../components/Footer";
import InformationCard from "../../components/InformationCard";
import LinkButton from "../../components/LinkButton";
import LinkPhrase from "../../components/Linkphrase";
import OrderCard from "../../components/OrderCard";
import { Link } from "react-router-dom";
import { getUser } from "../../services/ClientService";
import type { UserResponse } from "../../services/Interfaces";
import { getByUserId } from "../../services/SalesService";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import { getAllByUserId } from "../../services/DirectionService";
import { Helmet } from "../../components/Helmet";

export default function Dashboard() {
  const [directions, setDirections] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [containers, setContainers] = useState(0);
  const [alert, SetAlert] = useState(0);
  const { token } = useAuth();
  const handleSaveDirection = (updatedDirection: (typeof directions)[0]) => {
    setDirections((current) =>
      current.map((dir) =>
        dir.id === updatedDirection.id ? updatedDirection : dir,
      ),
    );
  };

  useEffect(() => {
    const chargeInformation = async () => {
      try {
        const result = await getUser(token, [
          "domicilio",
          "zona",
          "persona",
          "productosDomicilio",
          "diaDomicilio",
        ]);
        setUser(result);
        setContainers(0);
        result.persona.domicilios.forEach((domicilio) => {
          domicilio.productosDomicilio.forEach((producto) => {
            setContainers((current) => current + producto.cantVaciosActuales);
          });
        });
        const result2 = await getAllByUserId(
          token,
          null,
          null,
          null,
          null,
          null,
          ["diaDomicilio"],
          0,
          3,
        );
        setDirections(result2.content);

        const response = await getByUserId(
          token,
          ["lineaPedido", "productoZona", "producto", "domicilio"],
          "Mas Recientes",
          null,
          6,
          0,
        );
        console.log(response.content);
        setRecentOrders(response.content);
      } catch (error) {
        console.error("Error al traer usuario:", error);
      }
    };

    if (token) chargeInformation();
  }, [token]);

  const handleOrderCancelled = (orderId: number) => {
    setRecentOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, estado: "Cancelada" } : order,
      ),
    );
    SetAlert(orderId);
  };

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex flex-row justify-between mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Bienvenido, {user?.persona?.nombre ?? ""}{" "}
                {user?.persona?.apellido ?? ""}!
              </h1>
              <LinkButton
                name="Editar Perfil"
                url="/customer/profile"
                variant="outline"
                size="sm"
              />
            </div>
            <p className="text-lg text-muted-foreground">
              Gestiona tus pedidos, entregas y saldo desde aquí.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Link to="/customer/pay" className="w-full">
              <InformationCard
                svg={
                  <svg
                    fill="white"
                    className="w-full h-full"
                    version="1.2"
                    baseProfile="tiny"
                    id="MO0ney_sign_by_Adioma"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path d="M198.2,169.8c0-39.4-42.1-50.6-60.3-55.8c-34.4-9.6-37.3-22-36.8-28.3c1.2-15.5,18.2-19.3,34-15.9 c12.4,2.7,25.2,10,32.3,15.6L189.9,59c-11.1-7.6-25.3-17.4-46.1-21.4V12h-32.9v24.7C79,39.1,57.8,59.1,57.8,86.6 c0,26.8,19.4,39.4,38.8,48.8c16.2,7.7,61.4,15.8,58.8,36.2c-1.4,11.1-13.2,19.3-32.7,16.8c-17-2.1-35.2-16.4-35.2-16.4l-24.9,24.7 c15,12.1,30.9,19.7,48.2,23.2v24.1h32.9v-22.9C175.1,217.7,198.2,196.3,198.2,169.8z"></path>{" "}
                    </g>
                  </svg>
                }
                miniTitle="Saldo"
                title={new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(user?.persona?.saldo ?? 0)}
                description={
                  (user?.persona?.saldo ?? 0) < 0
                    ? "Poseés una deuda pendiente de pago."
                    : (user?.persona?.saldo ?? 0) >=
                          (user?.precioPedidosSemanales ?? 0) &&
                        (user?.precioPedidosSemanales ?? 0) > 0
                      ? "Tu saldo cubre tu próximo pedido semanal."
                      : user?.persona?.saldo === 0 &&
                          (user?.precioPedidosSemanales === 0 ||
                            !user?.precioPedidosSemanales)
                        ? "Tu saldo está al día y no tienes pedidos pendientes."
                        : "Tu saldo no alcanza para tu próximo pedido semanal."
                }
                cardColor={
                  (user?.persona?.saldo ?? 0) < 0
                    ? "redCard"
                    : ((user?.persona?.saldo ?? 0) >=
                          (user?.precioPedidosSemanales ?? 0) &&
                          (user?.precioPedidosSemanales ?? 0) > 0) ||
                        (user?.persona?.saldo === 0 &&
                          (user?.precioPedidosSemanales === 0 ||
                            !user?.precioPedidosSemanales))
                      ? "greenCard"
                      : "yellowCard"
                }
                titleColor="white"
                descriptionColor="white"
                size="sm"
              />
            </Link>
            <InformationCard
              svg={
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3H3.21922L6.78345 17.2569C5.73276 17.7236 5 18.7762 5 20C5 21.6569 6.34315 23 8 23C9.65685 23 11 21.6569 11 20C11 19.6494 10.9398 19.3128 10.8293 19H15.1707C15.0602 19.3128 15 19.6494 15 20C15 21.6569 16.3431 23 18 23C19.6569 23 21 21.6569 21 20C21 18.3431 19.6569 17 18 17H8.78078L8.28078 15H18C20.0642 15 21.3019 13.6959 21.9887 12.2559C22.6599 10.8487 22.8935 9.16692 22.975 7.94368C23.0884 6.24014 21.6803 5 20.1211 5H5.78078L5.15951 2.51493C4.93692 1.62459 4.13696 1 3.21922 1H2ZM18 13H7.78078L6.28078 7H20.1211C20.6742 7 21.0063 7.40675 20.9794 7.81078C20.9034 8.9522 20.6906 10.3318 20.1836 11.3949C19.6922 12.4251 19.0201 13 18 13ZM18 20.9938C17.4511 20.9938 17.0062 20.5489 17.0062 20C17.0062 19.4511 17.4511 19.0062 18 19.0062C18.5489 19.0062 18.9938 19.4511 18.9938 20C18.9938 20.5489 18.5489 20.9938 18 20.9938ZM7.00617 20C7.00617 20.5489 7.45112 20.9938 8 20.9938C8.54888 20.9938 8.99383 20.5489 8.99383 20C8.99383 19.4511 8.54888 19.0062 8 19.0062C7.45112 19.0062 7.00617 19.4511 7.00617 20Z"
                      fill="white"
                    ></path>{" "}
                  </g>
                </svg>
              }
              miniTitle="Productos"
              title={`Tienes ${containers} retornables en su hogar`}
              description="Los retornables son reutilizables por los que debera devolverlos a la hora de solicitar nuevos productos."
              cardColor="primary"
              titleColor="white"
              descriptionColor="white"
              size="sm"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Acciones Rápidas
            </h2>

            <div className="flex flex-col gap-4">
              {/* Acción principal (Destacada, ocupa el 100% del ancho) */}
              <div className="flex [&>a]:w-full shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <LinkButton
                  name="+ Agregar productos al pedido de esta semana"
                  url="/customer/newOrder"
                  variant="primary"
                  size="lg"
                />
              </div>

              {/* Acciones secundarias (Distribuidas abajo, más delgadas) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 [&>a]:w-full">
                <LinkButton
                  name="Ver Productos"
                  url="/products"
                  variant="outline"
                  size="md"
                />
                <LinkButton
                  name="Pedido Semanal"
                  url="/customer/weeklyOrder"
                  variant="outline"
                  size="md"
                />
                <LinkButton
                  name="Pagar Deuda"
                  url="/customer/Pay"
                  variant="outline"
                  size="md"
                />
              </div>
            </div>
          </div>
          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between flex-row mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Pedidos Recientes
              </h2>
              <LinkPhrase
                text="Ver Todos"
                url="/customer/orders"
                size="md"
                color="primary"
              />
            </div>
            {recentOrders.length === 0 ? (
              <InformationCard
                miniTitle="Pedidos"
                title="No realizaste ningún pedido"
                description="Realiza tu primer pedido para verlo aquí."
                cardColor="white"
                titleColor="black"
                descriptionColor="gray"
                size="sm"
              />
            ) : (
              <>
                {alert != 0 && alert != -1 ? (
                  <div className="mb-2">
                    <Alert
                      variant="success"
                      autoClose={true}
                      onClose={() => SetAlert(0)}
                    >
                      <AlertTitle>
                        ¡El pedido se ha cancelado con exito!
                      </AlertTitle>
                      <AlertDescription>
                        Muchas gracias por cancelar el pedido.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : alert == -1 ? (
                  <div className="mb-2">
                    <Alert
                      variant="danger"
                      autoClose={true}
                      onClose={() => SetAlert(0)}
                    >
                      <AlertTitle>
                        ¡El pedido no se ha podido cancelar!
                      </AlertTitle>
                      <AlertDescription>
                        Perdone las molestas por favor intente mas tarde.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      prop={order}
                      setAlert={handleOrderCancelled}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between flex-row m-6">
              <h2 className="text-xl font-semibold text-foreground">
                Direcciones
              </h2>
              <LinkPhrase
                text="Ver Todas"
                url="/customer/directions"
                size="md"
                color="primary"
              />
            </div>
            {directions.length === 0 ? (
              <InformationCard
                miniTitle="Direcciones"
                title="No tenés direcciones cargadas"
                description="Agregá una dirección para verla aquí."
                cardColor="white"
                titleColor="black"
                descriptionColor="gray"
                size="sm"
              />
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <button
                    key={1}
                    type="button"
                    disabled={true}
                    title={"NoDisponible"}
                    className={
                      "bg-gray-300 text-gray-500 cursor-not-allowed rounded-full px-3 py-2 text-sm font-medium transition "
                    }
                  >
                    Día no disponible para entregar en este domicilio
                  </button>
                  <button
                    type="button"
                    title={"Activo"}
                    className={
                      "bg-emerald-500 text-white shadow-sm rounded-full px-3 py-2 text-sm font-medium transition "
                    }
                  >
                    Día que se le pueden entregar productos a este domicilio
                  </button>
                  <button
                    type="button"
                    title={"Inactivo"}
                    className={
                      "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 rounded-full px-3 py-2 text-sm font-medium transition "
                    }
                  >
                    Día que no pueden entregar productos a este domicilio
                  </button>
                </div>
                {directions.map((direction) => (
                  <DireccionCard
                    key={direction.id}
                    direction={direction}
                    onSave={handleSaveDirection}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
