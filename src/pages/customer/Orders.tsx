import { useEffect, useState } from "react";
import Filter from "../../components/Filter";
import Footer from "../../components/Footer";
import OrderCard from "../../components/OrderCard";
import LinkButton from "../../components/LinkButton";
import { getByUserId } from "../../services/SalesService";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import Pagination from "../../components/Pagination";

export default function Orders() {
  const [state, setState] = useState("Todos");
  const [orderBy, setOrderBy] = useState("Mas Recientes");
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();
  const [alert, SetAlert] = useState(0)
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const size = 12

  useEffect(() => {
    const result = async () => {
      const response = await getByUserId(token, ['lineaPedido', 'productoZona', 'producto', 'domicilio'], orderBy, state, size, page - 1);
      setOrders(response.content);
      setTotalItems(response.totalElements);
    };
    result();
  }, [token, orderBy, state, page]);

  const handleOrderCancelled = (orderId: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, estado: 'Cancelada' } : order
      )
    );
    SetAlert(orderId);
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col mt-4 ">
        <NavBar />
        {alert != 0 && alert != -1 ?
          <div className="">
            <Alert variant="success" autoClose={true} onClose={() => SetAlert(0)}>
              <AlertTitle>¡El pedido se ha cancelado con exito.!</AlertTitle>
              <AlertDescription>Muchas gracias por cancelar el pedido.</AlertDescription>
            </Alert>
          </div>
          : alert == -1 ?
            <div>

              <Alert variant="danger" autoClose={true} onClose={() => SetAlert(0)}>
                <AlertTitle>¡El pedido no se ha podido cancelar.!</AlertTitle>
                <AlertDescription>Perdone las molestas por favor intente mas tarde .</AlertDescription>
              </Alert>
            </div>
            : ''
        }

        <div className="flex flex-col my-5 gap-4 mx-4 ">
          <div className="flex flex-row align-items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl">Mis Pedidos</h1>
              <p className="text-gray-600">Revisa el estado de tus pedidos y su historial.</p>
            </div>
            <LinkButton name="Nuevo Pedido" url="/customer/newOrder" variant="secondary" size="lg" />
          </div>
          <div className="flex flex-col sm:flex-row gap-1">
            <Filter
              name={state}
              options={['Todos', 'Pendientes', 'En Proceso', 'Completadas', 'Canceladas']}
              onSave={(v) => { setState(v); setPage(1); }}
              color="primary"
              size="md"
            />
            <Filter
              name={orderBy}
              options={['Mas Recientes', 'Mas Antiguos', 'Menor Precio', 'Mayor Precio']}
              onSave={(v) => { setOrderBy(v); setPage(1); }}
              color="primary"
              size="md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {orders.map(order => (
              <OrderCard prop={order} setAlert={handleOrderCancelled} />
            ))}
          </div>
        </div>
        <Pagination page={page} totalPerPage={size} totalItems={totalItems} onPageChange={setPage} />

        <Footer />
      </div>
    </div>

  );
}
