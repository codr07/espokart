import { useState } from "react";
import Navigation from "@/components/Navigation";
import { ThreeEditor } from "@/components/ThreeEditor";
import { DesignControls } from "@/components/DesignControls";

export interface DesignElement {
  id: string;
  type: "text" | "logo";
  content: string;
  color?: string;
  size?: number;
  position: [number, number, number];
  scale?: number;
}

const CustomDesign = () => {
  const [productType, setProductType] = useState<string>("jersey");
  const [elements, setElements] = useState<DesignElement[]>([]);

  const addElement = (element: Omit<DesignElement, "id">) => {
    setElements([...elements, { ...element, id: crypto.randomUUID() }]);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-center">3D Design Studio</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden" style={{ height: "600px" }}>
              <ThreeEditor
                productType={productType}
                elements={elements}
              />
            </div>
          </div>

          <div className="space-y-6">
            <DesignControls
              productType={productType}
              setProductType={setProductType}
              elements={elements}
              addElement={addElement}
              updateElement={updateElement}
              removeElement={removeElement}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;
