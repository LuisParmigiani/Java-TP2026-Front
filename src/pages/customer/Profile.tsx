import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import type { UserResponse } from "../../services/Interfaces.ts";
import { getUser } from "../../services/ClientService.ts";
import { useAuth } from "../../hooks/useAuth";
export default function Profile() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const { token } = useAuth();
    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await getUser(token);
                setUser(response);
                console.log("User data fetched successfully:", response);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, [token]);
    return (
        <div className="h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Perfil del Usuario</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Información Personal</h2>
                    <p className="mb-2"><strong>Nombre:</strong> Juan Pérez</p>
                    <p className="mb-2"><strong>Email:</strong> juan.perez@example.com</p>
                    <p className="mb-2"><strong>Dirección:</strong> Calle Falsa 123, Ciudad</p>
                    <p className="mb-2"><strong>Teléfono:</strong> +54 9 11 1234-5678</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}