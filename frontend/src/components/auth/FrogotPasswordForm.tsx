import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

interface ServerResponse {
  message: string;
  success: true;
}

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email", {
        icon: <XCircle className="text-red-600 w-5 h-5" />
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post<ServerResponse>(
        "https://smartscan-production.up.railway.app/api/v1/users/forgotPassword",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message || "Password reset link sent to your email", {
        icon: <CheckCircle className="text-green-600 w-5 h-5" />
      });
      navigate('/redirect');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong", {
          icon: <XCircle className="text-red-600 w-5 h-5" />
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Forgot Password</h1>
      <p className="mb-6 text-gray-600 text-center">
        Enter your registered email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="bg-white py-5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1e88e5] hover:bg-[#1976d2] py-6 text-base cursor-pointer"
        >
          {submitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="text-center mt-4">
        <span className="text-gray-600">Back to </span>
        <button
          onClick={() => navigate("/login")}
          className="text-[#1e88e5] hover:underline cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;