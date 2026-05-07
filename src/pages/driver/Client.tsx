import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import DirectionTable from "../../components/DirectionTable"
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import type { DiaZonaResponse } from "../../services/Interfaces";
import { Button } from "../../components/Button";
import { getDiaZonasByTruckAndMe } from "../../services/TruckService";
import { useAuth } from "../../hooks/useAuth";

export default function Client() {
    const [searchTerm, setSearchTerm] = useState('')
    const [realSearchTerm, setRealSearchTerm] = useState('')
    const [directions, setDirection] = useState<DiaZonaResponse[] | null>()
    const { token } = useAuth();
    const buscar = () => {
        setRealSearchTerm(searchTerm)
    }
    const clean = () => {
        setSearchTerm('')
        setRealSearchTerm('')
    }

    useEffect(() => {
        const search = async () => {
            try {
                const dayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
                const result = await getDiaZonasByTruckAndMe(token, dayName, null, null, realSearchTerm, ['zona', 'domicilio', 'diaZonaOrden']);
                setDirection(result)
                console.log(result)
            } catch (error) {
                console.log('asd', error)
            }
        }
        search()
    }, [realSearchTerm, token]
    )



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
                <DirectionTable directions={directions} />
            </div>

            <Footer />
        </div>
    )
}