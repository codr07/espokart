import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shirt, ShoppingBag, CircleDot, Hand, Zap } from 'lucide-react';

const products = [
  { id: 'jersey', name: 'Jersey', icon: Shirt },
  { id: 'hoodie', name: 'Hoodie', icon: ShoppingBag },
  { id: 'trousers', name: 'Trousers', icon: Shirt },
  { id: 'mousepad', name: 'Mousepad', icon: CircleDot },
  { id: 'cap', name: 'Cap', icon: Shirt },
  { id: 'tshirt', name: 'T-Shirt', icon: Shirt },
  { id: 'arm-sleeves', name: 'Arm Sleeves', icon: Hand },
  { id: 'finger-sleeves', name: 'Finger Sleeves', icon: Zap },
];

const CustomDesign = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0].id);
  const [canvasColor, setCanvasColor] = useState('#1a1a1a');
  const [textColor, setTextColor] = useState('#00ffff');

  const colors = [
    '#000000', '#ffffff', '#00ffff', '#ff00ff', '#00ff00', 
    '#ff0000', '#0000ff', '#ffff00', '#ff6600', '#6600ff'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-neon-blue">Custom</span>{' '}
            <span className="text-neon-magenta">Design Studio</span>
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Create your own unique gaming merchandise. Choose a product and customize it with your style.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product Selection */}
            <Card className="p-6 bg-card border-primary/20">
              <h3 className="text-xl font-bold mb-4 text-neon-blue">Select Product</h3>
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => {
                  const Icon = product.icon;
                  return (
                    <Button
                      key={product.id}
                      variant={selectedProduct === product.id ? 'default' : 'outline'}
                      className={`h-auto py-4 flex flex-col gap-2 ${
                        selectedProduct === product.id ? 'neon-glow-blue' : ''
                      }`}
                      onClick={() => setSelectedProduct(product.id)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs">{product.name}</span>
                    </Button>
                  );
                })}
              </div>
            </Card>

            {/* Design Canvas */}
            <Card className="lg:col-span-2 p-6 bg-card border-primary/20">
              <h3 className="text-xl font-bold mb-4 text-neon-magenta">Design Canvas</h3>
              
              <Tabs defaultValue="design" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                </TabsList>
                
                <TabsContent value="design" className="space-y-6">
                  {/* Canvas Preview */}
                  <div 
                    className="aspect-square rounded-lg border-2 border-primary/40 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: canvasColor }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                    <div className="relative z-10 text-center p-8">
                      <h2 
                        className="text-4xl font-bold mb-4"
                        style={{ color: textColor }}
                      >
                        YOUR DESIGN
                      </h2>
                      <p className="text-lg opacity-80" style={{ color: textColor }}>
                        {products.find(p => p.id === selectedProduct)?.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Add Text</label>
                      <input
                        type="text"
                        placeholder="Enter text..."
                        className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Text Size</label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        defaultValue="32"
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="colors" className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Background Color</label>
                    <div className="grid grid-cols-5 gap-3">
                      {colors.map((color) => (
                        <button
                          key={`bg-${color}`}
                          className={`w-full aspect-square rounded-lg border-2 transition-all ${
                            canvasColor === color ? 'border-primary scale-110' : 'border-border hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setCanvasColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Text Color</label>
                    <div className="grid grid-cols-5 gap-3">
                      {colors.map((color) => (
                        <button
                          key={`text-${color}`}
                          className={`w-full aspect-square rounded-lg border-2 transition-all ${
                            textColor === color ? 'border-primary scale-110' : 'border-border hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setTextColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex gap-4">
                <Button className="flex-1 neon-glow-blue" size="lg">
                  Save Design
                </Button>
                <Button variant="outline" size="lg" className="border-primary/20">
                  Reset
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CustomDesign;
