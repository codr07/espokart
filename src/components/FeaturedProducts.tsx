import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import productJersey from "@/assets/product-jersey-1.png";
import productHoodie from "@/assets/product-hoodie-1.png";
import productMousepad from "@/assets/product-mousepad-1.png";
import productCap from "@/assets/product-cap-1.png";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Cyber Pro Jersey",
      price: 79.99,
      image: productJersey,
      category: "Apparel",
    },
    {
      id: 2,
      name: "Neon Strike Hoodie",
      price: 89.99,
      image: productHoodie,
      category: "Apparel",
    },
    {
      id: 3,
      name: "Circuit Gaming Pad",
      price: 29.99,
      image: productMousepad,
      category: "Gear",
    },
    {
      id: 4,
      name: "Electro Cap",
      price: 34.99,
      image: productCap,
      category: "Apparel",
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-neon-blue">Products</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Handpicked gear for elite gamers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
