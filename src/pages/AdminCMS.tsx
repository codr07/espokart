import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Edit, Plus, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  image_url: string | null;
  stock: number;
  featured: boolean;
}

const AdminCMS = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    checkAdminRole();
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      loadCategories();
      loadProducts();
    }
  }, [isAdmin]);

  const checkAdminRole = async () => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: 'Error loading categories',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setCategories(data || []);
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: 'Error loading products',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setProducts(data || []);
  };

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', editingCategory.id);

      if (error) {
        toast({
          title: 'Error updating category',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Category updated successfully' });
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([categoryData]);

      if (error) {
        toast({
          title: 'Error creating category',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Category created successfully' });
    }

    setEditingCategory(null);
    loadCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting category',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Category deleted successfully' });
    loadCategories();
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category_id: formData.get('category_id') as string || null,
      image_url: formData.get('image_url') as string,
      stock: parseInt(formData.get('stock') as string),
      featured: formData.get('featured') === 'on',
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast({
          title: 'Error updating product',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Product updated successfully' });
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        toast({
          title: 'Error creating product',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Product created successfully' });
    }

    setEditingProduct(null);
    loadProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting product',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Product deleted successfully' });
    loadProducts();
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold neon-text">Admin CMS</h1>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card className="p-6 bg-card border-primary/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="neon-glow-blue" onClick={() => setEditingProduct(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit' : 'Add'} Product</DialogTitle>
                        <DialogDescription>
                          {editingProduct ? 'Update' : 'Create a new'} product in your store
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" defaultValue={editingProduct?.name} required />
                          </div>
                          <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" defaultValue={editingProduct?.slug} required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" defaultValue={editingProduct?.description || ''} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                          </div>
                          <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" name="stock" type="number" defaultValue={editingProduct?.stock || 0} required />
                          </div>
                          <div>
                            <Label htmlFor="category_id">Category</Label>
                            <select id="category_id" name="category_id" className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground">
                              <option value="">None</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id} selected={editingProduct?.category_id === cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="image_url">Image URL</Label>
                          <Input id="image_url" name="image_url" defaultValue={editingProduct?.image_url || ''} />
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="featured" name="featured" defaultChecked={editingProduct?.featured} />
                          <Label htmlFor="featured">Featured Product</Label>
                        </div>
                        <Button type="submit" className="w-full neon-glow-blue">Save Product</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.featured ? '⭐' : '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl bg-card">
                                <DialogHeader>
                                  <DialogTitle>Edit Product</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSaveProduct} className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="name">Product Name</Label>
                                      <Input id="name" name="name" defaultValue={product.name} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="slug">Slug</Label>
                                      <Input id="slug" name="slug" defaultValue={product.slug} required />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" defaultValue={product.description || ''} />
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label htmlFor="price">Price</Label>
                                      <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="stock">Stock</Label>
                                      <Input id="stock" name="stock" type="number" defaultValue={product.stock} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="category_id">Category</Label>
                                      <select id="category_id" name="category_id" className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground">
                                        <option value="">None</option>
                                        {categories.map((cat) => (
                                          <option key={cat.id} value={cat.id} selected={product.category_id === cat.id}>
                                            {cat.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="image_url">Image URL</Label>
                                    <Input id="image_url" name="image_url" defaultValue={product.image_url || ''} />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" id="featured" name="featured" defaultChecked={product.featured} />
                                    <Label htmlFor="featured">Featured Product</Label>
                                  </div>
                                  <Button type="submit" className="w-full neon-glow-blue">Update Product</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card className="p-6 bg-card border-primary/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Categories</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="neon-glow-blue" onClick={() => setEditingCategory(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card">
                      <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit' : 'Add'} Category</DialogTitle>
                        <DialogDescription>
                          {editingCategory ? 'Update' : 'Create a new'} product category
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveCategory} className="space-y-4">
                        <div>
                          <Label htmlFor="cat-name">Category Name</Label>
                          <Input id="cat-name" name="name" defaultValue={editingCategory?.name} required />
                        </div>
                        <div>
                          <Label htmlFor="cat-slug">Slug</Label>
                          <Input id="cat-slug" name="slug" defaultValue={editingCategory?.slug} required />
                        </div>
                        <div>
                          <Label htmlFor="cat-description">Description</Label>
                          <Textarea id="cat-description" name="description" defaultValue={editingCategory?.description || ''} />
                        </div>
                        <Button type="submit" className="w-full neon-glow-blue">Save Category</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setEditingCategory(category)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-card">
                                <DialogHeader>
                                  <DialogTitle>Edit Category</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSaveCategory} className="space-y-4">
                                  <div>
                                    <Label htmlFor="cat-name">Category Name</Label>
                                    <Input id="cat-name" name="name" defaultValue={category.name} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="cat-slug">Slug</Label>
                                    <Input id="cat-slug" name="slug" defaultValue={category.slug} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="cat-description">Description</Label>
                                    <Textarea id="cat-description" name="description" defaultValue={category.description || ''} />
                                  </div>
                                  <Button type="submit" className="w-full neon-glow-blue">Update Category</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminCMS;
