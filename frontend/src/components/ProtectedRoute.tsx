import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth?.user); 

  useEffect(() => {
    if (!user) {
      setTimeout(() => navigate('/'), 3000);
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center flex-col gap-6 text-center px-4"
        aria-label="authentication-required"
      >
        <p className="text-3xl font-semibold text-gray-800">
          🔒 You must be signed in to access this feature
        </p>
        <Button
          className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-xl hover:bg-blue-700 transition-all"
          onClick={() => navigate('/')}
        >
          Back To Home
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;