import Prueba from '../components/componente.tsx';
export default function HomePage() {
  return (
    <>
      <div className="bg-gray-500 w-full h-screen flex justify-center items-center">
        <Prueba></Prueba>
        <div className="border-primary border-2 bg-gray-100 text-2xl text-secondary">
          Agustin esta probando los colores
        </div>
      </div>
    </>
  );
}
