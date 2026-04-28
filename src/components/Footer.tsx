import LinkPhrase from "./Linkphrase";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-t border-border mt-auto  ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-xl">
                  SR
                </span>
              </div>
              <span className="font-bold text-xl text-foreground">
                Sodas Rojas
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Distribuidora de refrescos y agua purificada. Servicio a domicilio
              rápido y confiable en toda la ciudad.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-lg">
              Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-primary"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 5.5C3 4.67157 3.67157 4 4.5 4H8.2C8.601 4 8.98595 4.16005 9.26907 4.44427L10.9 6.08C11.1842 6.3642 11.5692 6.524 11.9704 6.524H19.5C20.3284 6.524 21 7.19557 21 8.024V18.5C21 19.3284 20.3284 20 19.5 20H4.5C3.67157 20 3 19.3284 3 18.5V5.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 14H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm">+52 123 456 7890</span>
              </div>

              <div className="flex items-center space-x-3">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-primary"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8L11.2 13.5C11.7 13.83 12.3 13.83 12.8 13.5L21 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 6H19C20.1046 6 21 6.89543 21 8V16C21 17.1046 20.1046 18 19 18H5C3.89543 18 3 17.1046 3 16V8C3 6.89543 3.89543 6 5 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm">sodaroja.java@gmail.com</span>
              </div>

              <div className="flex items-center space-x-3">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-primary"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21C12 21 18 15.5 18 10.5C18 7.18629 15.3137 4.5 12 4.5C8.68629 4.5 6 7.18629 6 10.5C6 15.5 12 21 12 21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm">Calle Principal 123, Centro</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-lg">
              Enlaces Rápidos
            </h3>
            <div className="space-y-2 flex flex-col">
              <LinkPhrase
                text="Inicio"
                url="/"
                size="md"
                color="blackPrimary"
              />
              <LinkPhrase
                text="Productos"
                url="/products"
                size="md"
                color="blackPrimary"
              />
              <LinkPhrase
                text="Nosotros"
                url="/about"
                size="md"
                color="blackPrimary"
              />
              <LinkPhrase
                text="Contacto"
                url="/contact"
                size="md"
                color="blackPrimary"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
