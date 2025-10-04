import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Type, Image, Palette } from 'lucide-react';

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

interface DesignControlsProps {
  onAddText: (element: Omit<TextElement, 'id'>) => void;
  onAddLogo: (element: Omit<LogoElement, 'id'>) => void;
  onColorChange: (color: string) => void;
  baseColor: string;
}

export const DesignControls = ({
  onAddText,
  onAddLogo,
  onColorChange,
  baseColor,
}: DesignControlsProps) => {
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(0.2);
  const [textPosition, setTextPosition] = useState<[number, number, number]>([0, 0, 0.2]);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoScale, setLogoScale] = useState(0.5);
  const [logoPosition, setLogoPosition] = useState<[number, number, number]>([0, 0.5, 0.2]);

  const colors = [
    '#000000', '#ffffff', '#00ffff', '#ff00ff', '#00ff00', 
    '#ff0000', '#0000ff', '#ffff00', '#ff6600', '#6600ff',
    '#1a1a1a', '#2d2d2d', '#404040', '#666666', '#999999'
  ];

  const handleAddText = () => {
    if (!textInput.trim()) return;
    
    onAddText({
      text: textInput,
      position: textPosition,
      color: textColor,
      size: textSize,
    });
    
    setTextInput('');
  };

  const handleAddLogo = () => {
    if (!logoUrl.trim()) return;
    
    onAddLogo({
      url: logoUrl,
      position: logoPosition,
      scale: logoScale,
    });
    
    setLogoUrl('');
  };

  return (
    <Card className="p-6 bg-card border-primary/20 h-full overflow-y-auto">
      <h3 className="text-xl font-bold mb-4 text-neon-magenta">Design Tools</h3>
      
      <Tabs defaultValue="color" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="color">
            <Palette className="h-4 w-4 mr-2" />
            Color
          </TabsTrigger>
          <TabsTrigger value="text">
            <Type className="h-4 w-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="logo">
            <Image className="h-4 w-4 mr-2" />
            Logo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-4">
          <div>
            <Label className="mb-3 block">Base Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                    baseColor === color ? 'border-primary scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <Label>Custom Color</Label>
            <Input
              type="color"
              value={baseColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-12 cursor-pointer"
            />
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <div>
            <Label htmlFor="text-input">Text Content</Label>
            <Input
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text..."
              className="bg-input"
            />
          </div>

          <div>
            <Label>Text Color</Label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {colors.slice(0, 10).map((color) => (
                <button
                  key={color}
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                    textColor === color ? 'border-primary scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setTextColor(color)}
                />
              ))}
            </div>
            <Input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-10 cursor-pointer"
            />
          </div>

          <div>
            <Label>Text Size: {textSize.toFixed(2)}</Label>
            <Slider
              value={[textSize]}
              onValueChange={([value]) => setTextSize(value)}
              min={0.1}
              max={0.5}
              step={0.05}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">X: {textPosition[0].toFixed(1)}</Label>
              <Slider
                value={[textPosition[0]]}
                onValueChange={([value]) => setTextPosition([value, textPosition[1], textPosition[2]])}
                min={-2}
                max={2}
                step={0.1}
              />
            </div>
            <div>
              <Label className="text-xs">Y: {textPosition[1].toFixed(1)}</Label>
              <Slider
                value={[textPosition[1]]}
                onValueChange={([value]) => setTextPosition([textPosition[0], value, textPosition[2]])}
                min={-2}
                max={2}
                step={0.1}
              />
            </div>
            <div>
              <Label className="text-xs">Z: {textPosition[2].toFixed(1)}</Label>
              <Slider
                value={[textPosition[2]]}
                onValueChange={([value]) => setTextPosition([textPosition[0], textPosition[1], value])}
                min={-1}
                max={1}
                step={0.1}
              />
            </div>
          </div>

          <Button onClick={handleAddText} className="w-full neon-glow-blue">
            Add Text
          </Button>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <div>
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="bg-input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a direct URL to an image
            </p>
          </div>

          <div>
            <Label>Logo Scale: {logoScale.toFixed(2)}</Label>
            <Slider
              value={[logoScale]}
              onValueChange={([value]) => setLogoScale(value)}
              min={0.2}
              max={2}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">X: {logoPosition[0].toFixed(1)}</Label>
              <Slider
                value={[logoPosition[0]]}
                onValueChange={([value]) => setLogoPosition([value, logoPosition[1], logoPosition[2]])}
                min={-2}
                max={2}
                step={0.1}
              />
            </div>
            <div>
              <Label className="text-xs">Y: {logoPosition[1].toFixed(1)}</Label>
              <Slider
                value={[logoPosition[1]]}
                onValueChange={([value]) => setLogoPosition([logoPosition[0], value, logoPosition[2]])}
                min={-2}
                max={2}
                step={0.1}
              />
            </div>
            <div>
              <Label className="text-xs">Z: {logoPosition[2].toFixed(1)}</Label>
              <Slider
                value={[logoPosition[2]]}
                onValueChange={([value]) => setLogoPosition([logoPosition[0], logoPosition[1], value])}
                min={-1}
                max={1}
                step={0.1}
              />
            </div>
          </div>

          <Button onClick={handleAddLogo} className="w-full neon-glow-blue">
            Add Logo
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
