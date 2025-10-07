import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import type { DesignElement } from "@/pages/CustomDesign";

interface DesignControlsProps {
  productType: string;
  setProductType: (type: string) => void;
  elements: DesignElement[];
  addElement: (element: Omit<DesignElement, "id">) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
}

export const DesignControls = ({
  productType,
  setProductType,
  elements,
  addElement,
  updateElement,
  removeElement,
}: DesignControlsProps) => {
  const [textContent, setTextContent] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(0.3);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoScale, setLogoScale] = useState(0.5);

  const productTypes = [
    { value: "jersey", label: "Jersey" },
    { value: "hoodie", label: "Hoodie" },
    { value: "trousers", label: "Trousers" },
    { value: "mousepad", label: "Mousepad" },
    { value: "cap", label: "Cap" },
    { value: "t-shirt", label: "T-Shirt" },
    { value: "arm-sleeves", label: "Arm Sleeves" },
    { value: "finger-sleeves", label: "Finger Sleeves" },
  ];

  const handleAddText = () => {
    if (textContent.trim()) {
      addElement({
        type: "text",
        content: textContent,
        color: textColor,
        size: textSize,
        position: [0, 0, 0.15],
      });
      setTextContent("");
    }
  };

  const handleAddLogo = () => {
    if (logoUrl.trim()) {
      addElement({
        type: "logo",
        content: logoUrl,
        scale: logoScale,
        position: [0, 0.5, 0.15],
      });
      setLogoUrl("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="product-type">Product Type</Label>
          <Select value={productType} onValueChange={setProductType}>
            <SelectTrigger id="product-type">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Add Text</TabsTrigger>
            <TabsTrigger value="logo">Add Logo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Text</Label>
              <Input
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter text"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text-color">Color</Label>
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text-size">Size</Label>
              <Input
                id="text-size"
                type="number"
                value={textSize}
                onChange={(e) => setTextSize(parseFloat(e.target.value))}
                min="0.1"
                max="1"
                step="0.1"
              />
            </div>
            
            <Button onClick={handleAddText} className="w-full">
              Add Text
            </Button>
          </TabsContent>
          
          <TabsContent value="logo" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input
                id="logo-url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo-scale">Scale</Label>
              <Input
                id="logo-scale"
                type="number"
                value={logoScale}
                onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                min="0.1"
                max="2"
                step="0.1"
              />
            </div>
            
            <Button onClick={handleAddLogo} className="w-full">
              Add Logo
            </Button>
          </TabsContent>
        </Tabs>

        {elements.length > 0 && (
          <div className="space-y-2">
            <Label>Elements</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {elements.map((element) => (
                <div
                  key={element.id}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm truncate flex-1">
                    {element.type}: {element.content}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeElement(element.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
