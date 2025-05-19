import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch} from "@/redux/store";
import { setUser } from "@/redux/authSlice";

interface ServerResponse {
  message: string;
  user: {
    userId: string,
    username: string,
    email: string,
    profilePicture?: string,
  };
  status: number;
}

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post<ServerResponse>('https://smartscan-production.up.railway.app/api/v1/users/login',
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );
      console.log(response)

      console.log(`Upload Success: ${response}`);
      if (response.status === 200) {
        dispatch(setUser(response.data.user));
        toast.success("User Logged In",{
          icon: <CheckCircle className="text-green-600 w-5 h-5" />
        });
        navigate('/');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Some error occurred";
      toast.error(message, {
        icon: <XCircle className="text-red-600 w-5 h-5" />
      });
    } finally {
      setIsLoading(false);
      setPassword('');
      setUsername('');
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-none">
      <CardHeader>
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <p className="text-muted-foreground text-center mt-2">
          Enter your credentials to access your account
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="username"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12"
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <a 
                href="/forgot-password" 
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-10"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 cursor-pointer" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5 cursor-pointer" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <Button className="w-full h-12 text-base font-medium cursor-pointer bg-white text-black border hover:bg-gray-300" onClick={() => navigate('/login-otp')}>Login With OTP</Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
