import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThreeEditor } from '@/components/ThreeEditor';
import { DesignControls } from '@/components/DesignControls';
import { Shirt, ShoppingBag, CircleDot, Hand, Zap, Download, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextElement {
  id: string;
  text: string;
  position: [number, number, number];
  color: string;
  size: number;
}

interface LogoElement {
  id: string;
  url: string;
  position: [number, number, number];
  scale: number;
}

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
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(products[0].id);
  const [baseColor, setBaseColor] = useState('#1a1a1a');
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [logoElements, setLogoElements] = useState<LogoElement[]>([]);

  const handleAddText = (element: Omit<TextElement, 'id'>) => {
    const newElement: TextElement = {
      ...element,
      id: `text-${Date.now()}`,
    };
    setTextElements([...textElements, newElement]);
    toast({
      title: 'Text added',
      description: 'Text element added to your design',
    });
  };

  const handleAddLogo = (element: Omit<LogoElement, 'id'>) => {
    const newElement: LogoElement = {
      ...element,
      id: `logo-${Date.now()}`,
    };
    setLogoElements([...logoElements, newElement]);
    toast({
      title: 'Logo added',
      description: 'Logo element added to your design',
    });
  };

  const handleSaveDesign = () => {
    const design = {
      product: selectedProduct,
      baseColor,
      textElements,
      logoElements,
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage for now
    localStorage.setItem('custom-design', JSON.stringify(design));
    
    toast({
      title: 'Design saved!',
      description: 'Your design has been saved successfully',
    });
  };

  const handleReset = () => {
    setTextElements([]);
    setLogoElements([]);
    setBaseColor('#1a1a1a');
    toast({
      title: 'Design reset',
      description: 'All elements have been cleared',
    });
  };

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
            <span className="text-neon-blue">3D Design</span>{' '}
            <span className="text-neon-magenta">Studio</span>
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Design your custom merchandise in 3D. Rotate, add text and logos at any position.
          </p>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Product Selection */}
            <Card className="p-6 bg-card border-primary/20 lg:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-neon-blue">Select Product</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {products.map((product) => {
                  const Icon = product.icon;
                  return (
                    <Button
                      key={product.id}
                      variant={selectedProduct === product.id ? 'default' : 'outline'}
                      className={`h-auto py-4 flex flex-col lg:flex-row items-center gap-2 ${
                        selectedProduct === product.id ? 'neon-glow-blue' : ''
                      }`}
                      onClick={() => setSelectedProduct(product.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{product.name}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  onClick={handleSaveDesign} 
                  className="w-full neon-glow-blue"
                  size="lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Design
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="w-full border-primary/20"
                  size="lg"
                >
                  Reset
                </Button>
              </div>
            </Card>

            {/* 3D Canvas */}
            <div className="lg:col-span-2">
              <Card className="p-4 bg-card border-primary/20 overflow-hidden">
                <div className="bg-background/50 rounded-lg overflow-hidden">
                  <ThreeEditor
                    productType={selectedProduct}
                    baseColor={baseColor}
                    textElements={textElements}
                    logoElements={logoElements}
                  />
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Drag to rotate • Scroll to zoom • Right-click to pan</p>
                </div>
              </Card>
            </div>

            {/* Design Controls */}
            <div className="lg:col-span-1">
              <DesignControls
                onAddText={handleAddText}
                onAddLogo={handleAddLogo}
                onColorChange={setBaseColor}
                baseColor={baseColor}
              />
            </div>
          </div>

          {/* Elements List */}
          {(textElements.length > 0 || logoElements.length > 0) && (
            <Card className="mt-6 p-6 bg-card border-primary/20">
              <h3 className="text-xl font-bold mb-4">Design Elements</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {textElements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-neon-blue">Text Elements</h4>
                    <div className="space-y-2">
                      {textElements.map((element) => (
                        <div key={element.id} className="p-3 bg-background/50 rounded-lg flex justify-between items-center">
                          <span style={{ color: element.color }}>{element.text}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTextElements(textElements.filter(e => e.id !== element.id))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {logoElements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-neon-magenta">Logo Elements</h4>
                    <div className="space-y-2">
                      {logoElements.map((element) => (
                        <div key={element.id} className="p-3 bg-background/50 rounded-lg flex justify-between items-center">
                          <span className="text-sm truncate">{element.url}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLogoElements(logoElements.filter(e => e.id !== element.id))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CustomDesign;
