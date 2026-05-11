import { useState, useEffect } from "react";
import { Helmet } from "./../../components/Helmet";
import NavBar from "./../../components/NavBar";
import Footer from "./../../components/Footer";
import { Card, CardContent } from "./../../components/Card";
import { Button } from "./../../components/Button";
import Input from "./../../components/Input";
import { Label } from "./../../components/Label";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../../components/Select";
import { productSchema,type ProductFormData } from "./productSchema.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./../../components/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/Table";
import { Badge } from "./../../components/Badge";
import { Plus, Edit, Trash2 ,Loader2} from "lucide-react";
import { toast } from "sonner";
import {
  addProduct,
  updateProduct,
  fetchProducts,
  deleteProduct,
} from "../../services/ProductService.ts";
import type { ProductoResponse } from "../../services/Interfaces";
import ProductPictureInput from "../../components/ProductPictureInput.tsx";
import { useAuth } from "../../hooks/useAuth.ts";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert.tsx";

const ProductsManagement = () => {
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductoResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<number | null>(
    null,
  );
  const { token ,loading: loadingAuth} = useAuth();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<{
    errorTitle: string;
    errorMessage: string;
  } | null>(null);
  useEffect(() => {
    if (!token && loadingAuth) return;
    fetchProducts(token)
      .then((data) => setProducts(data))
      .catch((error) => console.error("Failed to fetch products:", error));
  }, [token,loadingAuth]);
  const [formData, setFormData] = useState({
    nombre: "",
    detalle: "",
    precio: "",
    stock: "",
    activo: "1", // Por defecto activo
    imagenUrl: "",
  });
  const { currentUser, isAuthenticated } = useAuth();
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (
    !isAuthenticated ||
    !currentUser ||
    currentUser.role !== "Administrador"
  ) {
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
  const handleImageChange = async (file: File) => {
    if (!file) return;

    // Store the file for later upload
    setPendingImageFile(file);

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);

    // Update form state with temp URL
    setFormData((prev) => ({ ...prev, imagenUrl: tempUrl }));

    console.log("Imagen seleccionada✅");
  };
  const handleOpenDialog = (product: ProductoResponse | null = null) => {
    setFieldErrors({});
    setError(null);
    setShowAlert(false);
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        detalle: product.detalle,
        precio: product.precio.toString(),
        stock: product.stock.toString(),
        activo: product.activo ? "1" : "0",
        imagenUrl: product.imagenUrl || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: "",
        detalle: "",
        precio: "",
        stock: "",
        activo: "1",
        imagenUrl: "",
      });
    }
    setPendingImageFile(null); // Limpiar imagen pendiente al abrir el diálogo
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 1. Preparamos el payload
    const payload: ProductFormData = {
      nombre: formData.nombre,
      detalle: formData.detalle,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      activo: formData.activo,
      imagenUrl: formData.imagenUrl,
    };

    // 2. Ejecutamos validación Zod
    const result = productSchema.safeParse(payload);

    if (!result.success) {
      const issues = result.error.issues;
      const errors: Record<string, string> = {};
      for (const issue of issues) {
        const key = issue.path[0] ? String(issue.path[0]) : '_form';
        errors[key] = (errors[key] ? errors[key] + '. ' : '') + issue.message;
      }
      setFieldErrors(errors);
      setError({
        errorTitle: 'Formulario incompleto',
        errorMessage:
          'Por favor, revisa y corrige los campos marcados en rojo.',
      });
      setShowAlert(true);
      return;
    }

    // 3. Si todo está bien, limpiamos y guardamos
    setFieldErrors({});
    setError(null);
    setShowAlert(false);
    setIsLoading(true);

    try {
      const productData = {
        nombre: formData.nombre,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        activo: formData.activo === '1',
        detalle: formData.detalle,
      };
      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          productData,
          pendingImageFile,
          token,
        );
        toast.success('Producto actualizado correctamente.');
      } else {
        await addProduct(productData, pendingImageFile, token);
        toast.success('Producto agregado correctamente.');
      }
      const updatedProducts = await fetchProducts(token);
      setProducts(updatedProducts);
      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        nombre: '',
        detalle: '',
        precio: '',
        stock: '',
        activo: '1',
        imagenUrl: '',
      });
      setPendingImageFile(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(
        error?.response?.data?.message ||
          error?.mensaje ||
          'Ocurrió un error al guardar el producto.',
      );
    } finally {
      setIsLoading(false);
    }
  };;

  const handleDelete = (id: number) => {
    // Abrir diálogo de confirmación en vez de usar window.confirm
    setProductToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDeleteId === null) return;
    setIsDeleteDialogOpen(false);
    setIsLoading(true);
    try {
      await deleteProduct(productToDeleteId, token);
      const updated = await fetchProducts(token);
      setProducts(updated);
      toast.success("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error?.mensaje || error?.message || "No se pudo eliminar el producto.",
      );
    } finally {
      setIsLoading(false);
      setProductToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDeleteId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Gestión de Productos - Sodas Rojas</title>
      </Helmet>
      <NavBar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Productos
            </h1>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Producto
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-5">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {!product.imagenUrl ||
                        product.imagenUrl === './../../assets/producto.jpeg' ? (
                          <img
                            src={'./../../assets/producto.jpeg'}
                            alt={product.nombre}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          <img
                            src={
                              product.imagenUrl.startsWith('http') ||
                              product.imagenUrl.startsWith('https')
                                ? product.imagenUrl
                                : './../../assets/producto.jpeg'
                            }
                            alt={product.nombre}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell>{product.nombre}</TableCell>
                      <TableCell>{product.detalle}</TableCell>
                      <TableCell>${product.precio.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge
                          variant={product.activo ? 'default' : 'secondary'}
                        >
                          {product.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          className="mr-1"
                          variant="accent"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hay productos registrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-3 border-primary">
          <DialogHeader>
            <DialogTitle className="border-secondary border-b-3 w-fit rounded-xs">
              {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imagenUrl">Imagen</Label>
              <ProductPictureInput
                src={formData.imagenUrl || './../../assets/producto.jpeg'}
                onImageChange={handleImageChange}
                uploading={isLoading}
              />
              {fieldErrors.imagenUrl && (
                <span className="text-xs text-red-500">
                  {fieldErrors.imagenUrl}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                color="primary"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={(value) =>
                  setFormData({ ...formData, nombre: value as string })
                }
              />
              {fieldErrors.nombre && (
                <span className="text-xs text-red-500">
                  {fieldErrors.nombre}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="detalle">Detalle</Label>
              <Input
                color="primary"
                name="detalle"
                type="text"
                value={formData.detalle}
                onChange={(value) =>
                  setFormData({ ...formData, detalle: value as string })
                }
              />
              {fieldErrors.detalle && (
                <span className="text-xs text-red-500">
                  {fieldErrors.detalle}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio ($)</Label>
                <Input
                  name="precio"
                  type="number"
                  value={formData.precio}
                  onChange={(value) =>
                    setFormData({ ...formData, precio: value as string })
                  }
                />
                {fieldErrors.precio && (
                  <span className="text-xs text-red-500 block">
                    {fieldErrors.precio}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(value) =>
                    setFormData({ ...formData, stock: value as string })
                  }
                />
                {fieldErrors.stock && (
                  <span className="text-xs text-red-500 block">
                    {fieldErrors.stock}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activo">Estado</Label>
              <Select
                value={formData.activo}
                onValueChange={(val) =>
                  setFormData({ ...formData, activo: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Activo</SelectItem>
                  <SelectItem value="0">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.activo && (
                <span className="text-xs text-red-500">
                  {fieldErrors.activo}
                </span>
              )}
            </div>

            <div>
              {showAlert && (
                <Alert
                  variant="danger"
                  autoClose={true}
                  onClose={() => {
                    setShowAlert(false);
                    setError(null);
                  }}
                >
                  <AlertTitle>{error?.errorTitle}</AlertTitle>
                  <AlertDescription>{error?.errorMessage}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="danger"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-30">
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Guardando...
                  </span>
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">¿Estás seguro de eliminar este producto?</div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="grayTransparent"
              onClick={cancelDelete}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isLoading}
              className="min-w-30"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Eliminando...
                </span>
              ) : (
                'Eliminar'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ProductsManagement;
