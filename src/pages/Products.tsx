import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("categories").select("*"),
      ]);

      if (productsResponse.error) throw productsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const category = categories.find((c) => c.id === product.category_id);
    const matchesCategory = !categorySlug || category?.slug === categorySlug;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  const currentCategory = categories.find((c) => c.slug === categorySlug);

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
              {currentCategory ? (
                <>
                  {currentCategory.name}{" "}
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
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glassmorphism rounded-lg p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant={!categorySlug ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => (window.location.href = "/products")}
                    >
                      All
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={categorySlug === cat.slug ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() =>
                          (window.location.href = `/products?category=${cat.slug}`)
                        }
                      >
                        {cat.name}
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
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : (
                <>
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
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image_url}
                      category={
                        categories.find((c) => c.id === product.category_id)?.name || "Uncategorized"
                      }
                    />
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
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
