import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shirt, Gamepad2, Home } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      name: "Apparel",
      icon: Shirt,
      description: "Jerseys, Hoodies & More",
      color: "neon-blue",
      link: "/products?category=apparel",
    },
    {
      name: "Gear",
      icon: Gamepad2,
      description: "Mousepads, Accessories",
      color: "neon-magenta",
      link: "/products?category=gear",
    },
    {
      name: "Decor",
      icon: Home,
      description: "Posters, Collectibles",
      color: "neon-green",
      link: "/products?category=decor",
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
            Shop by <span className="text-neon-magenta">Category</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Find exactly what you need
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={category.link}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="glassmorphism rounded-lg p-8 cyber-border group cursor-pointer transition-all duration-300 hover:neon-glow-blue"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-full bg-${category.color}/10 group-hover:bg-${category.color}/20 transition-colors`}>
                        <Icon className={`h-12 w-12 text-${category.color}`} />
                      </div>
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
