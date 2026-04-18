import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./Button";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import {
  Menu,
  LogOut,
  User,
  Package,
  Truck,
  LayoutDashboard,
} from "lucide-react";

interface NavLink {
  path: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const publicLinks: NavLink[] = [
    { path: "/", label: "Inicio" },
    { path: "/products-showcase", label: "Productos" },
    { path: "/about", label: "Nosotros" },
    { path: "/contact", label: "Contacto" },
  ];

  const customerLinks: NavLink[] = [
    { path: "/customer/dashboard", label: "Panel", icon: LayoutDashboard },
    { path: "/products", label: "Productos", icon: Package },
    { path: "/customer/orders", label: "Pedidos", icon: Truck },
    { path: "/customer/profile", label: "Perfil", icon: User },
  ];

  const driverLinks: NavLink[] = [
    { path: "/driver/dashboard", label: "Panel", icon: LayoutDashboard },
    { path: "/driver/daily-route", label: "Ruta Diaria", icon: Truck },
    { path: "/driver/stock-control", label: "Inventario", icon: Package },
  ];

  const adminLinks: NavLink[] = [
    { path: "/admin/dashboard", label: "Panel", icon: LayoutDashboard },
    { path: "/admin/products", label: "Productos", icon: Package },
    { path: "/admin/customers", label: "Clientes", icon: User },
    { path: "/admin/employees", label: "Empleados", icon: User },
    { path: "/admin/trucks", label: "Camiones", icon: Truck },
  ];

  const getNavLinks = () => {
    if (!isAuthenticated) return publicLinks;
    if (currentUser?.role === "Administrador") return adminLinks;
    if (currentUser?.role === "Empleado") return driverLinks;
    if (currentUser?.role === "Usuario") return customerLinks;

    return publicLinks;
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-foreground border-b border-border glass-effect">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-xl">
                SR
              </span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block text-foreground border-b-4 border-secondary">
              Sodas Rojas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 mx-2 rounded-lg text-md font-medium transition-all duration-200 ${isActive(link.path)
                    ? "bg-primary text-white shadow-s hover:border-2 hover:border-black transition-all duration-100"
                    : "hover:text-foreground hover:border-2 hover:border-b-4 hover:border-primary"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {!isAuthenticated ? (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild variant="primary">
                  <Link to="/register">Registrarse</Link>
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-muted-foreground mr-2 inline-block">
                  {currentUser?.name || currentUser?.email}
                </span>
                <User className="text-white border-2 border-primary bg-primary rounded-2xl w-8 h-8" />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  className=""
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-muted"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-75 sm:w-100 bg-white text-foreground border-l border-border"
            >
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-muted"
                      }`}
                  >
                    {link.icon &&
                      React.createElement(link.icon, { className: "w-5 h-5" })}
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="border-t border-border pt-4">
                  {!isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full mb-2 text-foreground hover:bg-muted"
                        asChild
                      >
                        <Link
                          to="/login"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Iniciar Sesión
                        </Link>
                      </Button>
                      <Button className="w-full" variant="primary" asChild>
                        <Link
                          to="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Registrarse
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-muted-foreground mb-2 flex items-center space-x-2 gap-2">
                        <User className="text-white border-2 border-primary bg-primary rounded-2xl w-8 h-8" />
                        {currentUser?.name || currentUser?.email}
                      </div>
                      <Button
                        variant="danger"
                        className="w-full"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Salir
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
