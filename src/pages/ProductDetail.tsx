import { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import productJersey from "@/assets/product-jersey-1.png";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  // Mock product data
  const product = {
    id: 1,
    name: "Cyber Pro Jersey",
    price: 79.99,
    image: productJersey,
    category: "Apparel",
    description:
      "Premium esports jersey featuring breathable fabric, moisture-wicking technology, and sleek cyberpunk design. Perfect for competitive gaming and casual wear.",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    features: [
      "Breathable mesh fabric",
      "Moisture-wicking technology",
      "Durable sublimation printing",
      "Professional esports fit",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="glassmorphism rounded-lg overflow-hidden cyber-border aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-neon-blue">
                    ${product.price}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Select Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
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

              {/* Quantity */}
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
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button variant="neon" size="lg" className="flex-1 gap-2">
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

              {/* Product Details Tabs */}
              <Tabs defaultValue="features" className="mt-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="sizing">Sizing</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="space-y-2 mt-4">
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="sizing" className="mt-4">
                  <p className="text-muted-foreground">
                    Standard athletic fit. For a looser fit, consider sizing up.
                  </p>
                </TabsContent>
                <TabsContent value="shipping" className="mt-4">
                  <p className="text-muted-foreground">
                    Free shipping on orders over $100. Standard delivery: 5-7
                    business days.
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
