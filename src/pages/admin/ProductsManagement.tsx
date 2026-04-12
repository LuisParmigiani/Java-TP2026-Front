import { useState, useEffect } from 'react';
import { Helmet } from './../../components/Helmet';
import NavBar from './../../components/NavBar';
import Footer from './../../components/Footer';
import { Card, CardContent  } from './../../components/Card';
import { Button } from './../../components/Button';
import Input from './../../components/Input';
import { Label } from './../../components/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './../../components/Select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './../../components/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './../../components/Table';
import { Badge } from './../../components/Badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchProducts } from '../../services/ProductService.ts';
import type { ProductoResponse } from '../../services/Interfaces';

const ProductsManagement = () => {
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductoResponse | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(error => console.error('Failed to fetch products:', error));
  }, []);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    activo: 'true',
  });

  const handleOpenDialog = (product: ProductoResponse | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        precio: product.precio.toString(),
        stock: product.stock.toString(),
        activo: (product.activo ?? true) ? 'true' : 'false',
      });
    } else {
      setEditingProduct(null);
      setFormData({ nombre: '', precio: '', stock: '', activo: 'true' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio || !formData.stock) {
      toast.error('Por favor completa todos los campos requeridos.');
      return;
    }
    if (Number(formData.precio) <= 0 || Number(formData.stock) < 0) {
      toast.error('El precio y stock deben ser valores válidos.');
      return;
    }

    const newProduct: ProductoResponse = {
      id: editingProduct ? editingProduct.id : Math.floor(Math.random() * 10000),
      nombre: formData.nombre,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      activo: formData.activo === 'true',
      detalle: editingProduct?.detalle || 'Nuevo producto',
      imagenUrl: editingProduct?.imagenUrl || '',
    };

    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? newProduct : p)),
      );
      toast.success('Producto actualizado correctamente.');
    } else {
      setProducts([...products, newProduct]);
      toast.success('Producto agregado correctamente.');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Producto eliminado.');
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
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.id}
                      </TableCell>
                      <TableCell>
                        {product.imagenUrl ? (
                          <img
                            src={product.imagenUrl}
                            alt={product.nombre}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                            Sin foto
                          </div>
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
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={(value) =>
                  setFormData({ ...formData, nombre: value })
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
                    setFormData({ ...formData, precio: value })
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
                    setFormData({ ...formData, stock: value })
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
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ProductsManagement;
