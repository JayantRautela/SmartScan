import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

interface ServerResponse {
  message: string;
  success: true;
}

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill out both fields", {
          icon: <XCircle className="text-red-600 w-5 h-5" />
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        icon: <XCircle className="text-red-600 w-5 h-5" />
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post<ServerResponse>(
        "https://smartscan-production.up.railway.app/api/v1/users/resetPassword",
        { token, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message || "Password reset successfully", {
        icon: <CheckCircle className="text-green-600 w-5 h-5" />
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password", {
            icon: <XCircle className="text-red-600 w-5 h-5" />
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center mt-20 text-xl text-red-600">
        Invalid or missing token.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
      <p className="text-gray-600 mb-6 text-center">
        Enter a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block font-medium mb-1">
            New Password
          </label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-white py-5"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium mb-1">
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white py-5"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#1e88e5] hover:bg-[#1976d2] py-6 text-base cursor-pointer"
          disabled={submitting}
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;