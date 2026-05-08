import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import DirectionTable from "../../components/DirectionTable"
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import type { DiaZonaOrdenResponse, DiaZonaResponse, VentaResponse } from "../../services/Interfaces";
import { Button } from "../../components/Button";
import { getDiaZonasByTruckAndMe } from "../../services/TruckService";
import { useAuth } from "../../hooks/useAuth";
import { getVentasHoyByDomicilioId } from "../../services/SalesService";
import OrderDetailModal from "../../components/OrderDetailModal";


export default function Client() {
    const [searchTerm, setSearchTerm] = useState('')
    const [realSearchTerm, setRealSearchTerm] = useState('')
    const [directions, setDirection] = useState<DiaZonaResponse[] | null>()
    const [openDelivery, setOpenDelivery] = useState<DiaZonaOrdenResponse | null>(null);
    const [sale, setSale] = useState<VentaResponse | null>(null);
    const [saleLoading, setSaleLoading] = useState(false);

    const { token } = useAuth();

    const buscar = () => {
        setRealSearchTerm(searchTerm)
    }
    const clean = () => {
        setSearchTerm('')
        setRealSearchTerm('')
    }

    const fetchSales = async (domicilioId: number) => {
        setSaleLoading(true);
        setSale(null);
        try {
            const response = await getVentasHoyByDomicilioId(domicilioId, [
                'lineaPedido',
                'productoZona',
                'producto',
            ]);
            setSale(response);
        } catch (error) {
            console.error("Error fetching sales:", error);
            setSale(null);
        } finally {
            setSaleLoading(false);
        }
    };

    useEffect(() => {
        const search = async () => {
            try {
                const dayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
                const result = await getDiaZonasByTruckAndMe(token, dayName, null, null, realSearchTerm, ['zona', 'domicilio', 'diaZonaOrden', 'persona', 'productosDomicilio']);
                setDirection(result)
            } catch (error) {
                console.log('asd', error)
            }
        }
        search()
    }, [realSearchTerm, token])



    return (
        <div>
            <NavBar />
            <h1 className="text-2xl ml-7 my-6">
                Clientes:
            </h1>

            <div className="m-3 flex felx-row gap-3 items-center ">
                <Input
                    placeholder='Buscar domicilio'
                    color='primary'
                    size='md'
                    name="Buscar domicilio..."
                    type="text"
                    onChange={(value) => {
                        if (typeof value === 'string') {
                            setSearchTerm(value);
                        }
                    }}
                    value={searchTerm}
                />
                <Button variant='primary' size='md' onClick={buscar}>Buscar</Button>
                <Button variant='secondary' size='md' onClick={clean}>Borrar</Button>
            </div>
            <div className="m-4">
                <DirectionTable
                    directions={directions}
                    onRealizarVenta={(delivery) => {
                        setOpenDelivery(delivery);
                        fetchSales(delivery.domicilio?.id || 0);
                    }}

                />
            </div>


            <OrderDetailModal
                open={openDelivery !== null}
                onClose={() => { setOpenDelivery(null); setSale(null); }}
                delivery={openDelivery}
                sale={sale}
                loading={saleLoading}
                onSaleUpdated={() => {
                    if (openDelivery) {
                        setDirection(prev =>
                            prev
                                ?.map(diaZona => ({
                                    ...diaZona,
                                    diaZonaOrdenes: diaZona.diaZonaOrdenes.filter(d => d.id !== openDelivery.id),
                                }))
                                .filter(diaZona => diaZona.diaZonaOrdenes.length > 0)
                        );
                    }
                }}
            />
            <Footer />
        </div>
    )
}
