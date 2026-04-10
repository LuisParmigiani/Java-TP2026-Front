import { useState } from "react";
import Filter from "../../components/Filter";
import Footer from "../../components/footer";
import OrderCard from "../../components/OrderCard";

const orders = [
    {
        id: 1,
        date: '2023-01-01',
        status: 'Pendiente',
        total: 100.00
    },
    {
        id: 2,
        date: '2023-02-01',
        status: 'Enviado',
        total: 200.00
    },
    {
        id: 3,
        date: '2023-03-01',
        status: 'Entregado',
        total: 300.00
    }
];

export default function Orders() {
    const [state, setState] = useState('Todos');
    return (
        <div className="min-h-screen flex flex-col mt-4">
            <div className="flex flex-col mb-4 gap-4 mx-4">
                <h1 className="text-4xl">Mis Pedidos</h1>

                <p className="text-gray-600">Revisa el estado de tus pedidos y su historial.</p>
                <div className="flex flex-row">
                    <Filter
                        name={state}
                        options={['Todos', 'Pendientes', 'Enviados', 'Entregados']}
                        onSave={setState}
                        color="primary"
                        size="md"
                    />
                    <Filter
                        name={state}
                        options={['Todos', 'Pendientes', 'Enviados', 'Entregados']}
                        onSave={setState}
                        color="primary"
                        size="md"
                    />
                    <Filter
                        name={state}
                        options={['Todos', 'Pendientes', 'Enviados', 'Entregados']}
                        onSave={setState}
                        color="primary"
                        size="md"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {orders.map(order => (
                        <OrderCard key={order.id} orderNumber={order.id.toString()} status={order.status} date={order.date} total={order.total.toFixed(2)} />
                    ))}
                </div>
            </div>

            <Footer />
        </div>

    );
}