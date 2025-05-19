import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/authSlice";
import { CheckCircle, XCircle } from "lucide-react";

interface ServerResponse {
  message: string;
  user: {
    userId: string;
    username: string;
    email: string;
  };
  status: number;
}

const OtpLoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"send" | "verify">("send");
  const [loading, setLoadingState] = useState(false);
  const { user } = useSelector((store: any) => store.auth);

  const navigate = useNavigate();

  if (user) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col gap-5">
        <p className="text-4xl text-gray-800">User is already Logged In</p>
        <Button className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-xl hover:bg-blue-700 transition" onClick={() => navigate('/')}>Back To Home</Button>
      </div>
    )
  }

  const handleSendOtp = async () => {
    if (!email) return toast.error("email is required", {
      icon: <XCircle className="text-red-600 w-5 h-5" />
    });

    try {
      setLoadingState(true);
      await axios.post(
        "https://smartscan-production.up.railway.app/api/v1/users/sendOtp",
        { email },
        { withCredentials: true }
      );
      toast.success("OTP sent to your registered email", {
        icon: <CheckCircle className="text-green-600 w-5 h-5" />
      });
      setStep("verify");
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || "Some error occurred";
        toast.error(message, {
          icon: <XCircle className="text-red-600 w-5 h-5" />
        });
        setEmail('');
      } finally {
        setLoadingState(false);
      }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("OTP is required");

    try {
      setLoadingState(true);
      const response = await axios.post<ServerResponse>(
        "https://smartscan-production.up.railway.app/api/v1/users/verifyOtp",
        {
          email,
          otp: Number(otp),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(setUser(response.data.user));
        toast.success("User Logged In", {
          icon: <CheckCircle className="text-green-600 w-5 h-5" />,
        });
        navigate("/");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message) {
        toast.error(error.response.data.message, {
          icon: <XCircle className="text-red-600 w-5 h-5" />
        });
      } else {
        toast.error(error.message, {
          icon: <XCircle className="text-red-600 w-5 h-5" />
        });
      }
    } finally {
      setLoadingState(false);
      setOtp('');
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-r from-neutral-300 to-stone-400 flex items-center justify-center">
      <div className="w-full max-w-md px-6">
      <h1 className="text-3xl font-bold mb-6">Log In with OTP</h1>

      {step === "send" ? (
        <div className="space-y-4">
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white py-5"
          />
          <Button
            onClick={handleSendOtp}
            className="w-full bg-[#1e88e5] hover:bg-[#1976d2] py-6 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            OTP sent to your registered email. Please check and enter below.
          </p>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="bg-white py-5"
          />
          <Button
            onClick={handleVerifyOtp}
            className="w-full bg-[#1e88e5] hover:bg-[#1976d2] py-6 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
        )}
      </div>
    </div>
  );
};

export default OtpLoginForm;
