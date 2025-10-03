import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import productJersey from "@/assets/product-jersey-1.png";
import productHoodie from "@/assets/product-hoodie-1.png";
import productMousepad from "@/assets/product-mousepad-1.png";
import productCap from "@/assets/product-cap-1.png";

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [priceRange, setPriceRange] = useState([0, 200]);

  // Mock products data
  const allProducts = [
    { id: 1, name: "Cyber Pro Jersey", price: 79.99, image: productJersey, category: "apparel" },
    { id: 2, name: "Neon Strike Hoodie", price: 89.99, image: productHoodie, category: "apparel" },
    { id: 3, name: "Circuit Gaming Pad", price: 29.99, image: productMousepad, category: "gear" },
    { id: 4, name: "Electro Cap", price: 34.99, image: productCap, category: "apparel" },
    { id: 5, name: "Quantum Jersey", price: 74.99, image: productJersey, category: "apparel" },
    { id: 6, name: "Vapor Hoodie", price: 94.99, image: productHoodie, category: "apparel" },
    { id: 7, name: "Hyper Mousepad", price: 39.99, image: productMousepad, category: "gear" },
    { id: 8, name: "Pulse Cap", price: 29.99, image: productCap, category: "apparel" },
  ];

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category ? (
                <>
                  {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                  <span className="text-neon-blue">Collection</span>
                </>
              ) : (
                <>
                  All <span className="text-neon-blue">Products</span>
                </>
              )}
            </h1>
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glassmorphism rounded-lg p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {["All", "Apparel", "Gear", "Decor"].map((cat) => (
                      <Button
                        key={cat}
                        variant={
                          (cat === "All" && !category) ||
                          cat.toLowerCase() === category
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start"
                        onClick={() => {
                          window.location.href =
                            cat === "All"
                              ? "/products"
                              : `/products?category=${cat.toLowerCase()}`;
                        }}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </motion.div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No products found. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
