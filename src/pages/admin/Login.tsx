import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAdminOTP, verifyAdminOTP } from "@/lib/auth-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroups, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendAdminOTP(email);
      setStep("otp");
      toast({ title: "Code sent!", description: "Check your email for the 6-digit code." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleVerify = async () => {
    try {
      await verifyAdminOTP(email, otp);
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Invalid Code", description: error.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
        {step === "email" ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Admin Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Button type="submit" className="w-full">Send Access Code</Button>
          </form>
        ) : (
          <div className="space-y-6 flex flex-col items-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroups className="gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroups>
            </InputOTP>
            <Button onClick={handleVerify} className="w-full">Verify & Enter</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;