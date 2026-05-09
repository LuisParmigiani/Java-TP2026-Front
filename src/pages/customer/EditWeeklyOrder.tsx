import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getById } from "../../services/DirectionService";
import ProductTable from "../../components/ProductTable";
import { getActiveProducts } from "../../services/ProductService";
import { useAuth } from "../../hooks/useAuth";
import ProductCard from "../../components/ProductCard";
import type { ProductoResponse } from "../../services/Interfaces";
import ProductsFilter from "../../components/ProductsFilter";
import { createWeeklyOrder } from "../../services/WeeklyOrdersService.ts";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import LinkButton from "../../components/LinkButton";
import { Helmet } from "../../components/Helmet";
import { Link } from "react-router-dom";

export default function EditWeeklyOrder() {
  const [selectedProducts, setSelectedProducts] = useState<
    { product: ProductoResponse; quantity: number }[]
  >([]);
  const [initialProducts, setInitialProducts] = useState<
    { product: ProductoResponse; quantity: number }[]
  >([]);
  const location = useLocation();
  const domicilioId = location.state?.domicilioId;
  const [products, setProducts] = useState([]);
  const { token } = useAuth();
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | "">("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | "">("");
  const [appliedDirection, setAppliedDirection] = useState<string>("0");
  const [sortOption, setSortOption] = useState<string>("Mas Recientes");
  const [directionName, setDirectionName] = useState<string>("");
  const [alert, setAlert] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!domicilioId) return;

    const fetchData = async () => {
      try {
        const response = await getById(domicilioId, [
          "pedidoSemanal",
          "productoZona",
          "producto",
        ]);
        if (response) {
          if (
            response.pedidosSemanales &&
            Array.isArray(response.pedidosSemanales)
          ) {
            const lineasDesdeServidor = response.pedidosSemanales.map(
              (linea) => ({
                product: linea.productoZona.producto,
                quantity: linea.cantidad,
              }),
            );
            setDirectionName(response.calle + " " + response.numero);
            setSelectedProducts(lineasDesdeServidor);
            setInitialProducts(lineasDesdeServidor);
          }
          setAppliedDirection(String(response.id));
        }
        const productsResponse = await getActiveProducts(
          token,
          null,
          sortOption,
          appliedSearchTerm,
          appliedMinPrice,
          appliedMaxPrice,
          appliedDirection,
        );
        setProducts(productsResponse.content);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchData();
  }, [
    domicilioId,
    token,
    appliedSearchTerm,
    appliedMinPrice,
    appliedMaxPrice,
    appliedDirection,
    sortOption,
  ]);

  // Convierte selectedProducts al formato de tabla
  const tableLinesData = selectedProducts
    .filter((item) => item.quantity > 0)
    .map((item, index) => ({
      id: item.product.id || index,
      productoZona: {
        id: item.product.id || index,
        producto: item.product,
      },
      cantidad: item.quantity,
      subtotal: item.quantity * item.product.precio,
    }));

  const totalAmount = tableLinesData.reduce(
    (acc, linea) => acc + linea.subtotal,
    0,
  );

  // Detecta si hay cambios comparando con el estado inicial
  const hasChanges =
    selectedProducts.length !== initialProducts.length ||
    selectedProducts.some((product, index) => {
      const initialProduct = initialProducts[index];
      return (
        !initialProduct ||
        product.product.id !== initialProduct.product.id ||
        product.quantity !== initialProduct.quantity
      );
    });

  // Función para cancelar cambios
  const handleCancelChanges = () => {
    setSelectedProducts(initialProducts);
  };
  const postNewSemanalOrder = async () => {
    setSaving(true);
    try {
      const newOrders = selectedProducts.map((item) => ({
        cantidad: item.quantity,
        productoId: item.product.id,
      }));

      await createWeeklyOrder(newOrders, domicilioId, []);
      setAlert(1);
    } catch (error) {
      console.error("Error al enviar el pedido semanal modificado:", error);
      setAlert(-1);
    } finally {
      setSaving(false);
    }
  };
  const { currentUser, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser || currentUser.role !== "Usuario") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Helmet>
          <title>Acceso Denegado - Sodas Rojas</title>
          <meta
            name="description"
            content="Acceso denegado al panel de administración"
          />
        </Helmet>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-lg mb-6">
            No tienes permiso para acceder a esta página.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <NavBar />
      {alert === 1 && (
        <div className="fixed inset-0 flex items-center justify-center z-50  border-gray-200 bg-gray-50/60">
          <div className="rounded-xl  p-4">
            <Alert variant="success">
              <AlertTitle>
                ¡El pedido semanal se ha modificado con exito.!
              </AlertTitle>
              <AlertDescription>
                <div className="flex flex-col items-center gap-2">
                  Muchas gracias por modificar el pedido semanal.
                  <LinkButton
                    url="/customer/editWeeklyOrder"
                    variant="outline"
                    size="sm"
                    name="Finalizar."
                  />
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      {alert === -1 && (
        <div>
          <Alert variant="danger" autoClose={true} onClose={() => setAlert(0)}>
            <AlertTitle>
              ¡El pedido semanal no se ha podido modificar.!
            </AlertTitle>
            <AlertDescription>
              Perdone las molestas por favor intente mas tarde .
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="min-h-screen m-8 ">
        <h1>Editar Pedido Semanal: Direccion {directionName}</h1>
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
          <p className="mb-4 text-sm font-semibold text-gray-700">
            Resumen del pedido
          </p>
          {<ProductTable lineasPedido={tableLinesData} total={totalAmount} />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <button
            disabled={!hasChanges || saving}
            className="my-6 w-full px-6 py-3 rounded-md bg-primary text-white hover:bg-primary-hover text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={postNewSemanalOrder}
          >
            {saving && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {saving ? "Guardando..." : "Modificar"}
          </button>
          <button
            disabled={!hasChanges}
            className="my-6 w-full px-6 py-3 rounded-md bg-red-500 text-white hover:bg-red-600 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCancelChanges}
          >
            Cancelar Cambios
          </button>
        </div>
        <ProductsFilter
          setAppliedSearchTerm={setAppliedSearchTerm}
          setAppliedMinPrice={setAppliedMinPrice}
          setAppliedMaxPrice={setAppliedMaxPrice}
          setAppliedDirection={setAppliedDirection}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                // Busca si el producto ya está seleccionado
                const selected = selectedProducts.find(
                  (item) => item.product.id === product.id,
                );
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    Cant={selected ? selected.quantity : 0}
                    setCant={(value) => {
                      setSelectedProducts((prev) => {
                        // Si ya está seleccionado, actualiza la cantidad
                        const exists = prev.find(
                          (item) => item.product.id === product.id,
                        );
                        if (exists) {
                          if (value === 0) {
                            // Si la cantidad es 0, lo elimina de la selección
                            return prev.filter(
                              (item) => item.product.id !== product.id,
                            );
                          }
                          return prev.map((item) =>
                            item.product.id === product.id
                              ? { ...item, quantity: value }
                              : item,
                          );
                        } else {
                          // Si no está, lo agrega si value > 0
                          if (value > 0) {
                            return [...prev, { product, quantity: value }];
                          }
                          return prev;
                        }
                      });
                    }}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
