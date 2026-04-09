import LinkButton from "../components/linkButton"
import MiniCard from "../components/miniCard"
import ProductCard from "../components/productCard";

const productos = [
  {
    id: 1,
    name: "Coca-Cola",
    description: "Refresco clásico de cola, disponible en varias presentaciones.",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=2070&auto=format&fit=crop",
    price: 1.99
  },
  {
    id: 2,
    name: "Pepsi",
    description: "Refresco de cola con un sabor único y refrescante.",
    image: "https://images.unsplash.com/photo-1589923188900-9c3a1eaa1b8c?q=80&w=2070&auto=format&fit=crop",
    price: 1.99
  },
  {
    id: 3,
    name: "Agua Purificada",
    description: "Agua de la mejor calidad, ideal para mantenerte hidratado.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
    price: 0.99
  },
  {
    id: 4,
    name: "Fanta",
    description: "Refresco de frutas con un sabor dulce y refrescante.",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=2070&auto=format&fit=crop",
    price: 1.99
  },
  {
    id: 5,
    name: "Sprite",
    description: "Refresco de limón y lima, perfecto para refrescarte en cualquier momento.",
    image: "https://images.unsplash.com/photo-1589923188900-9c3a1eaa1b8c?q=80&w=2070&auto=format&fit=crop",
    price: 1.99
  },
  {
    id: 6,
    name: "Jarritos",
    description: "Refrescos mexicanos de sabores frutales, ideales para cualquier ocasión.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
    price: 1.49
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full min-h-[600px] flex items-center justify-center bg-muted overflow-hidden">
          <div className="absolute inset-0 z-0" >
            <img 
              src="https://images.unsplash.com/photo-1687069185135-a65edd256382?q=80&w=2070&auto=format&fit=crop" 
              alt="Refrescos variados" 
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                <span>Refresca tu día</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight w-2/3 ">
                Las mejores bebidas, <span className="text-primary">directo a tu puerta.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Sodas Rojas es tu distribuidora de confianza. Ofrecemos una amplia variedad de refrescos y agua purificada con entrega rápida y segura.
              </p>
              <div className="gap-3 flex">
                <LinkButton name="Ver Catalogo  " size="lg" variant="primary" url="/products-showcase" />
                <LinkButton name="Contactanos  " size="lg" variant="gray" url="/contact" />
              </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿Por qué elegir Sodas Rojas?</h2>
              <p className="text-muted-foreground text-xl text-gray-500 ">Nos dedicamos a brindarte el mejor servicio de distribución con beneficios pensados para ti.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
              
                <MiniCard svg={
                  <svg fill="#000000" className="h-full w-full" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M110.933,320c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2s51.2-22.963,51.2-51.2 C162.133,342.963,139.17,320,110.933,320z M110.933,405.333c-18.825,0-34.133-15.309-34.133-34.133s15.309-34.133,34.133-34.133 s34.133,15.309,34.133,34.133S129.758,405.333,110.933,405.333z"></path> </g> </g> <g> <g> <path d="M396.919,320c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2c28.237,0,51.2-22.963,51.2-51.2 C448.12,342.963,425.148,320,396.919,320z M396.919,405.333c-18.825,0-34.133-15.309-34.133-34.133s15.309-34.133,34.133-34.133 s34.133,15.309,34.133,34.133S415.735,405.333,396.919,405.333z"></path> </g> </g> <g> <g> <path d="M503.467,294.4h-8.533V98.133c0-4.719-3.823-8.533-8.533-8.533H221.867c-18.825,0-34.133,15.309-34.133,34.133v179.2 h-17.067v-128c0-4.719-3.823-8.533-8.533-8.533h-102.4c-2.85,0-5.513,1.425-7.1,3.797l-51.2,76.8 C0.503,248.397,0,250.052,0,251.733V345.6c0,4.719,3.823,8.533,8.533,8.533h25.6c3.618,0,6.844-2.287,8.047-5.692 c9.617-27.213,35.49-45.508,64.384-45.508c17.937,0,39.518,6.519,50.202,15.164c1.545,1.254,3.447,1.903,5.367,1.903h25.6v25.6 c0,4.719,3.823,8.533,8.533,8.533h128.222c3.618,0,6.844-2.287,8.047-5.692c9.617-27.213,35.49-45.508,64.384-45.508 c28.732,0,54.485,18.099,64.23,45.082c1.041,3.533,4.309,6.118,8.183,6.118h34.133c4.71,0,8.533-3.814,8.533-8.533v-42.667 C512,298.214,508.177,294.4,503.467,294.4z M64.299,183.467h55.168V243.2H24.474L64.299,183.467z M153.6,296.311 c-15.147-7.125-33.527-10.445-47.036-10.445c-34.057,0-64.759,20.344-78.234,51.2H17.067V294.4H25.6 c4.71,0,8.533-3.814,8.533-8.533c0-4.719-3.823-8.533-8.533-8.533h-8.533v-17.067H128c4.71,0,8.533-3.814,8.533-8.533v-68.267 H153.6V296.311z M494.933,337.067h-19.789c-13.474-30.857-44.177-51.2-78.225-51.2c-34.057,0-64.759,20.344-78.234,51.2H204.8 V123.733c0-9.412,7.654-17.067,17.067-17.067h256v153.6h-8.533c-4.71,0-8.533,3.814-8.533,8.533s3.823,8.533,8.533,8.533h8.533 v25.6c0,4.719,3.823,8.533,8.533,8.533h8.533V337.067z"></path> </g> </g> </g></svg>
                } title="Entregas a Domicilio" description="Llevamos tus productos directamente a tu puerta." />
              <MiniCard svg={
                  <svg className="w-15/16 h-15/16 p-auto m-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z" fill="#1C274C"></path> </g></svg>
                } title="Pedidos Programados" description="Configura entregas semanales automáticas" />
              
              <MiniCard svg={
                <svg viewBox="0 0 24 24" className="w-full h-full"  fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.99999 14C8.99999 13.4477 8.55227 13 7.99999 13C7.4477 13 6.99999 13.4477 6.99999 14C6.99999 15.3574 7.26721 16.7375 8.08236 17.7972C8.93437 18.9048 10.2571 19.5 12 19.5C12.5523 19.5 13 19.0523 13 18.5C13 17.9477 12.5523 17.5 12 17.5C10.7429 17.5 10.0656 17.0952 9.66761 16.5778C9.23276 16.0125 8.99999 15.1426 8.99999 14Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4228 1.54267C12.6513 0.711988 11.348 0.712021 10.5766 1.54273C9.63287 2.55896 7.89116 4.5305 6.37916 6.77881C4.87045 9.02222 3.46953 11.5773 3.49416 14.3526C3.49633 14.5981 3.50939 14.9426 3.55218 15.3536C3.63717 16.17 3.84245 17.278 4.33361 18.4008C4.82693 19.5285 5.61868 20.6923 6.88173 21.5709C8.15052 22.4536 9.82552 23 11.9997 23C14.1739 23 15.8489 22.4536 17.1178 21.5709C18.3808 20.6923 19.1727 19.5286 19.6661 18.4009C20.1573 17.2781 20.3627 16.17 20.4477 15.3536C20.4905 14.9427 20.5036 14.5982 20.5058 14.3527C20.5306 11.5774 19.1293 9.02208 17.6206 6.77875C16.1084 4.53043 14.3666 2.55889 13.4228 1.54267ZM8.03877 7.89491C9.44577 5.80274 11.0797 3.94302 11.9997 2.94942C12.9198 3.94301 14.5539 5.80273 15.961 7.89491C17.2351 9.78932 18.5269 11.9805 18.5059 14.3348C18.5042 14.5268 18.4938 14.8074 18.4585 15.1464C18.3873 15.83 18.2176 16.722 17.8338 17.5992C17.4521 18.4715 16.8689 19.3078 15.9756 19.9291C15.0882 20.5465 13.8256 21 11.9997 21C10.1738 21 8.91129 20.5465 8.02387 19.9291C7.13071 19.3078 6.54754 18.4715 6.16596 17.5992C5.78221 16.722 5.61259 15.8301 5.54142 15.1465C5.50613 14.8074 5.49578 14.5269 5.49408 14.3349C5.4732 11.9806 6.76469 9.78944 8.03877 7.89491Z" fill="#0F0F0F"></path> </g></svg>
                } title="Agua Purificada" description="La mejor calidad en agua y bebidas" />
              
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-muted/50 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Productos Destacados</h2>
              <p className="text-muted-foreground text-lg mb-8">Descubre nuestras bebidas más populares.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {productos.map((producto) => (
                  <ProductCard key={producto.id} {...producto} />
                ))}
              </div>
            </div>
          </div> </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-200 ">¿Listo para hacer tu primer pedido?</h2>
            <p className="text-xl mb-10 text-gray-300 leading-relaxed">
              Regístrate hoy mismo y comienza a disfrutar de la comodidad de recibir tus bebidas favoritas sin salir de casa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <LinkButton name="Crear Cuenta Gratis" size="lg" variant="white" url="/register" />
              <LinkButton name="Pedir por WhatsApp" size="lg" variant="grayTransparent" url="/contact" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
