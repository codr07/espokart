import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="glassmorphism rounded-lg overflow-hidden cyber-border transition-all duration-300 group-hover:neon-glow-blue">
        <Link to={`/product/${id}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
        
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
              <Link to={`/product/${id}`}>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-neon-blue">${price}</span>
            <Button variant="cyber" size="sm" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
