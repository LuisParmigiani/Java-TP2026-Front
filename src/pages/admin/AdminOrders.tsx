import { useEffect, useState } from "react";
import Filter from "../../components/Filter";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import AdminOrderCard from "../../components/AdminOrderCard";
import { getPending, updateSale } from "../../services/SalesService";
import { fetchZones } from "../../services/ZoneService";
import { useAuth } from "../../hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import Pagination from "../../components/Pagination";
import { Helmet } from "../../components/Helmet";
import { Link } from "react-router-dom";
import type { VentaResponse, ZonaResponse } from "../../services/Interfaces";

export default function AdminOrders() {
    const [orderBy, setOrderBy] = useState("Mas Recientes");
    const [zona, setZona] = useState("Todas");
    const [zones, setZones] = useState<ZonaResponse[]>([]);
    const [orders, setOrders] = useState<VentaResponse[]>([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [alert, setAlert] = useState<{ type: "success" | "danger"; msg: string } | null>(null);
    const { token, currentUser, isAuthenticated, loading } = useAuth();
    const size = 12;

    useEffect(() => {
        if (!token) return;
        fetchZones(token).then(setZones).catch(() => { });
    }, [token]);

    useEffect(() => {
        if (!token) return;
        const fetchOrders = async () => {
            try {
                const response = await getPending(
                    token,
                    zona,
                    orderBy,
                    ["lineaPedido", "productoZona", "producto", "domicilio", "zona", "persona"],
                    page - 1,
                    size,
                );
                setOrders(response.content);
                setTotalItems(response.totalElements);
            } catch {
                setAlert({ type: "danger", msg: "Error al cargar los pedidos." });
            }
        };
        fetchOrders();
    }, [token, orderBy, zona, page]);

    const handleAccept = async (id: number) => {
        try {
            await updateSale(id, { estado: "En proceso" }, token);
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, estado: "En proceso" } : o))
            );
            setAlert({ type: "success", msg: "Pedido aceptado correctamente." });
        } catch {
            setAlert({ type: "danger", msg: "No se pudo aceptar el pedido." });
        }
    };

    const handleDeny = async (id: number) => {
        try {
            await updateSale(id, { estado: "Cancelada" }, token);
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, estado: "Cancelada" } : o))
            );
            setAlert({ type: "success", msg: "Pedido denegado." });
        } catch {
            setAlert({ type: "danger", msg: "No se pudo denegar el pedido." });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        );
    }

    if (!isAuthenticated || !currentUser || currentUser.role !== "Administrador") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Helmet>
                    <title>Acceso Denegado - Sodas Rojas</title>
                    <meta name="description" content="Acceso denegado" />
                </Helmet>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
                    <p className="text-lg mb-6">No tienes permiso para acceder a esta página.</p>
                    <Link to="/" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Helmet>
                <title>Gestión de Pedidos - Sodas Rojas</title>
                <meta name="description" content="Panel de gestión de pedidos" />
            </Helmet>

            <NavBar />

            {alert && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                    <Alert variant={alert.type} autoClose onClose={() => setAlert(null)}>
                        <AlertTitle>{alert.type === "success" ? "¡Éxito!" : "Error"}</AlertTitle>
                        <AlertDescription>{alert.msg}</AlertDescription>
                    </Alert>
                </div>
            )}

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Gestión de Pedidos</h1>
                    <p className="text-gray-600 mt-2">Revisá y administrá todos los pedidos entrantes.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <Filter
                        name={zona}
                        options={["Todas", ...zones.map((z) => z.nombre)]}
                        onSave={(v) => { setZona(v); setPage(1); }}
                        color="primary"
                        size="md"
                    />
                    <Filter
                        name={orderBy}
                        options={["Mas Recientes", "Mas Antiguos", "Menor Precio", "Mayor Precio"]}
                        onSave={(v) => { setOrderBy(v); setPage(1); }}
                        color="primary"
                        size="md"
                    />
                </div>

                {orders.length === 0 ? (
                    <div className="flex items-center justify-center py-24 text-gray-400 text-lg">
                        No hay pedidos para mostrar.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order) => (
                            <AdminOrderCard
                                key={order.id}
                                order={order}
                                onAccept={handleAccept}
                                onDeny={handleDeny}
                            />
                        ))}
                    </div>
                )}

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
