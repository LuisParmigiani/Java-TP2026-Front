import { Button } from "../../components/Button";
import Filter from "../../components/Filter";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import Input from "../../components/Input";
import { useEffect, useState } from "react";

export default function SemanalOrder() {
    const [searchTerm, setSearchTerm] = useState("");
    const [orderBy, setOrderBy] = useState('Nombre A-Z');
    const [actualSearchTerm, setActualSearchTerm] = useState("");

    const handleSearch = () => {
        setActualSearchTerm(searchTerm);
    };

    useEffect(() => {
        console.log("Buscando productos con el término:", actualSearchTerm, "y ordenando por:", orderBy);
    }, [actualSearchTerm, orderBy]);
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pb-6">
            <NavBar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex-1 ">
                <h1 className="text-2xl font-semibold mb-6 tracking-tight">Pedido Semanal</h1>
                <div className="grid grid-cols-1 md:grid-cols-2  gap-4 ">
                    <Filter
                        name={"Ordenar por:"}
                        options={['Nombre A-Z', 'Nombre Z-A']}
                        onSave={(value) => setOrderBy(value)}
                        color="primary"
                        size="md"
                    />
                    <div className="flex gap-2 flex-1 justify-end items-center ">
                        <Input
                            placeholder='Buscar producto...'
                            color='primary'
                            size='md'
                            name="Buscar producto"
                            type="text"
                            onChange={(value) => {
                                if (typeof value === 'string') {
                                    setSearchTerm(value);
                                }
                            }}
                            value={searchTerm}
                        />
                        <Button color='primary' size='md' onClick={handleSearch} className="px-4">Buscar</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-full">
                            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col h-full transition-colors hover:border-primary/60">
                                <h2 className="text-base font-medium mb-2 text-gray-900">Pedido Semanal</h2>
                                <div className="mb-3 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Dirección</p>
                                    <p className="text-sm mt-1 text-gray-700">LA DIRECCION DE TU MM</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full border border-primary text-primary bg-transparent hover:bg-primary/10 transition-colors"
                                    onClick={() => alert("ver pedido semanal")}
                                >
                                    Ver Pedido Semanal
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </main >
            <Footer />
        </div >
    );
}