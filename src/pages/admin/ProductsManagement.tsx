import { useState, useEffect } from "react";
import { Helmet } from "./../../components/Helmet";
import NavBar from "./../../components/NavBar";
import Footer from "./../../components/Footer";
import { Card, CardContent } from "./../../components/Card";
import { Button } from "./../../components/Button";
import Input from "./../../components/Input";
import { Label } from "./../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../../components/Select";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  addProduct,
  fetchProducts,
  updateProduct,
  uploadImage,
} from "../../services/ProductService.ts";
import type { ProductoResponse } from "../../services/Interfaces";
import ProductPictureInput from "../../components/ProductPictureInput.tsx";
import { useAuth } from "../../hooks/useAuth.ts";

const ProductsManagement = () => {
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductoResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts(token)
      .then((data) => setProducts(data))
      .catch((error) => console.error("Failed to fetch products:", error));
  }, [token]);
  const [formData, setFormData] = useState({
    nombre: "",
    detalle: "",
    precio: "",
    stock: "",
    activo: "1", // Por defecto activo
    imagenUrl: "",
  });
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
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio || !formData.stock) {
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }
    if (Number(formData.precio) <= 0 || Number(formData.stock) < 0) {
      toast.error("El precio y stock deben ser valores válidos.");
      return;
    }

    setIsLoading(true);
    try {
      // Crear/actualizar producto
      const productData = {
        nombre: formData.nombre,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        activo: formData.activo === "1",
        detalle: formData.detalle,
        imagenUrl: "./../../assets/producto.jpeg", // Valor temporal, se actualizará después de subir la imagen
      };
      let savedProduct: ProductoResponse;
      if (editingProduct) {
        console.log("updeteando producto");
        savedProduct = await updateProduct(
          editingProduct.id,
          productData,
          token,
        );
        toast.success("Producto actualizado correctamente.");
      } else {
        console.log("guardando producto");
        savedProduct = await addProduct(productData, token);
        toast.success("Producto agregado correctamente.");
      }
      if (pendingImageFile && savedProduct.id) {
        console.log("📤 Uploading profile image for new user...");
        try {
          const imageResponse = await uploadImage(
            pendingImageFile,
            savedProduct.id,
          );
          console.log("✅ Profile image uploaded successfully:", imageResponse);
          // Actualiza solo el campo imagenUrl sin pasar el id
          await updateProduct(
            savedProduct.id,
            {
              imagenUrl: imageResponse,
              nombre: productData.nombre,
              precio: productData.precio,
              stock: productData.stock,
              activo: productData.activo,
              detalle: productData.detalle,
            },
            token,
          );
          console.log("Producto actualizado con URL de imagen");
        } catch (imageError) {
          console.error(
            "No se pudo subir la imagen, pero se creo el usuario",
            imageError,
          );
        }
      }

      const updatedProducts = await fetchProducts(token);
      setProducts(updatedProducts);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Ocurrió un error al guardar el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Producto eliminado.");
    }
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
                    <TableHead>ID</TableHead>
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
                      <TableCell className="font-medium">
                        {product.id}
                      </TableCell>
                      <TableCell>
                        {product.imagenUrl == "./../../assets/producto.jpeg" ? (
                          <img
                            src={product.imagenUrl}
                            alt={product.nombre}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          <img
                            src={`http://localhost:8080${product.imagenUrl}?t=${new Date().getTime()}`}
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
                          variant={product.activo ? "default" : "secondary"}
                        >
                          {product.activo ? "Activo" : "Inactivo"}
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
              {editingProduct ? "Editar Producto" : "Agregar Producto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imagenUrl">Imagen</Label>
              <ProductPictureInput
                src={formData.imagenUrl || "./../../assets/producto.jpeg"}
                onImageChange={handleImageChange}
                uploading={isLoading}
              />
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
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="danger"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ProductsManagement;
