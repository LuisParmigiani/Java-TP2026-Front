import { useEffect, useState } from "react";
import Filter from "../../components/Filter";
import Footer from "../../components/Footer";
import OrderCard from "../../components/OrderCard";
import LinkButton from "../../components/LinkButton";
import { getByUserId } from "../../services/SalesService";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../hooks/useAuth";


export default function Orders() {
  const [state, setState] = useState("Todos");
  const [orderBy, setOrderBy] = useState("Mas Recientes");
  const [orders, setOrders] = useState([] as any[]);
  const { token } = useAuth();

  useEffect(() => {
    const result = async () => {
      const response = await getByUserId(token, ['lineaPedido', 'productoZona', 'producto']);
      setOrders(response);
    };
    result();
  }, [token]);

  return (
    <div>
      <div>
        <div className="min-h-screen flex flex-col mt-4">
          <NavBar />
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
                options={['Todos', 'Pendientes', 'Enviados', 'Entregados']}
                onSave={setState}
                color="primary"
                size="md"
              />
              <Filter
                name={orderBy}
                options={['Mas Recientes', 'Mas antiguos', 'Menor precio', 'Mayor precio']}
                onSave={setOrderBy}
                color="primary"
                size="md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {orders.map(order => (
                <OrderCard prop={order} />
              ))}
            </div>
          </div>

          <Footer />
        </div>
        <div className="flex flex-col sm:flex-row gap-1">
          <Filter
            name={state}
            options={["Todos", "Pendientes", "Enviados", "Entregados"]}
            onSave={setState}
            color="primary"
            size="md"
          />
          <Filter
            name={orderBy}
            options={[
              "Mas Recientes",
              "Mas antiguos",
              "Menor precio",
              "Mayor precio",
            ]}
            onSave={setOrderBy}
            color="primary"
            size="md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard prop={order} />
          ))}
        </div>
      </div >

      <Footer />
    </div >
  );
}
