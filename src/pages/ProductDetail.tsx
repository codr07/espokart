import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (productError) throw productError;

      setProduct(productData);

      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("*")
          .eq("id", productData.category_id)
          .single();

        setCategory(categoryData);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(
      (item: any) => item.id === product.id && item.size === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        size: selectedSize,
        image: product.image_url,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const handleSendWhatsApp = () => {
    const message = `Hi! I'm interested in:\n\nProduct: ${product.name}\nPrice: ₹${product.price}\nSize: ${selectedSize}\nQuantity: ${quantity}\n\nPlease share design options.`;
    const whatsappUrl = `https://chat.whatsapp.com/KzhM39RYqeVDlfkdH59Uok?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="glassmorphism rounded-lg overflow-hidden cyber-border aspect-square">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                {category && (
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                    {category.name}
                  </p>
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-neon-blue">
                    ₹{product.price}
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-sm text-green-500">In Stock ({product.stock})</span>
                  ) : (
                    <span className="text-sm text-destructive">Out of Stock</span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>

              <div>
                <h3 className="text-sm font-semibold mb-3">Select Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center glassmorphism rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 text-lg font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="neon" 
                  size="lg" 
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="cyber" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="cyber" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 border-green-500 text-green-500 hover:bg-green-500/10"
                onClick={handleSendWhatsApp}
              >
                <MessageCircle className="h-5 w-5" />
                Send Design Request on WhatsApp
              </Button>

              <Tabs defaultValue="details" className="mt-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-2 mt-4">
                  <p className="text-muted-foreground">
                    {product.description}
                  </p>
                </TabsContent>
                <TabsContent value="shipping" className="mt-4">
                  <p className="text-muted-foreground">
                    Free shipping on orders over ₹1000. Standard delivery: 5-7 business days.
                  </p>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
