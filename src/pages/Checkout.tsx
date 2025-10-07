import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import upiQr from "@/assets/upi-qr.jpg";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const shipping = 100;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("orders").insert({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        payment_method: paymentMethod,
        total_amount: total,
        items: cartItems,
        status: "pending",
      });

      if (error) throw error;

      localStorage.removeItem("cart");
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <p className="text-center text-muted-foreground">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-neon-blue">Checkout</span>
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glassmorphism rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address *</Label>
                <Textarea
                  id="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div className="glassmorphism rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    Cash on Delivery (COD)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                  <RadioGroupItem value="UPI" id="upi" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">
                    UPI Payment
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "UPI" && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm mb-4 text-center">Scan QR code to pay</p>
                  <img
                    src={upiQr}
                    alt="UPI QR Code"
                    className="w-64 h-64 mx-auto rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    After payment, click "Place Order" to confirm
                  </p>
                </div>
              )}
            </div>

            <div className="glassmorphism rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                {cartItems.map((item: any) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity} ({item.size})</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-neon-blue">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="neon"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
