import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAdminOTP, verifyAdminOTP } from "@/lib/auth-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

/**
 * AdminLogin handles the two-step passwordless authentication flow.
 * Step 1: Request a 6-digit OTP to be sent to the admin email.
 * Step 2: Verify the OTP to establish a Supabase session.
 */
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
      toast({ 
        title: "Code sent!", 
        description: "Please check your email for the 6-digit verification code." 
      });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message || "Failed to send verification code." 
      });
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({ 
        variant: "destructive", 
        title: "Incomplete Code", 
        description: "Please enter the full 6-digit code." 
      });
      return;
    }

    try {
      await verifyAdminOTP(email, otp);
      toast({ title: "Success", description: "Authenticated successfully." });
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Invalid Code", 
        description: error.message || "The code entered is incorrect or has expired." 
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <div className="p-8 bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Secure access for authorized personnel only.
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="admin@visionblueprintsltd.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Send Access Code
            </Button>
          </form>
        ) : (
          <div className="space-y-6 flex flex-col items-center">
            <div className="space-y-2 text-center w-full">
              <p className="text-sm font-medium">Enter 6-digit code</p>
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={setOtp}
                  onComplete={handleVerify}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <div className="w-full space-y-2">
              <Button onClick={handleVerify} className="w-full">
                Verify & Enter
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setStep("email")}
              >
                Back to email 
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;