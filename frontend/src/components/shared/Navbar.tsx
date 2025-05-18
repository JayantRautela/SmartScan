import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";
import { CheckCircle, Menu, X, XCircle, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import type { AppDispatch } from "@/redux/store";
import axios from "axios";

interface ServerResponse {
  status: number;
  message: string;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((store: any) => store.auth);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const clickHandler = () => {
    navigate("/signup");
  };

  const redirectToLogin = () => {
    navigate('/login');
  }

  const logoutHandler = async () => {
    try {
      const res = await axios.get<ServerResponse>(
        `https://skillscan-backend-production.up.railway.app/api/v1/users/logout`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message, {
          icon: <CheckCircle className="text-green-600 w-5 h-5" />,
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Some error occurred";
      toast.error(message, {
        icon: <XCircle className="text-red-600 w-5 h-5" />,
      });
    }
  };

  return (
    <nav className="h-16 w-full flex items-center justify-between px-6 bg-black text-white relative md:px-10">
      <Link
        to="/"
        className="tracking-tighter text-lg cursor-pointer font-bold"
      >
        SmartScan
      </Link>

      <div className="hidden md:flex gap-10">
        <Link to='/calculate-ats'>Calculate ATS</Link>
        <Link to="/resume-analysis">Resume Analysis</Link>
        <Link to="/about-us">About Us</Link>
      </div>

      <div className="md:hidden">
        <button onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? (
            <X className="cursor-pointer w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6 cursor-pointer" />
          )}
        </button>
      </div>

      <div className="hidden md:block">
        {!user ? (
          <div className="space-x-4">
            <Button
            className="bg-blue-500 px-6 cursor-pointer hover:bg-blue-600"
            onClick={clickHandler}
            >
              Sign Up
            </Button>
            <Button className="w-20 cursor-pointer" onClick={redirectToLogin}>Login</Button>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer">
                {user?.profilePicture && <AvatarImage src={user.profilePicture} />}
                <AvatarFallback>
                  <User className="text-black" />
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                <Avatar className="cursor-pointer">
                  {user?.profilePicture && <AvatarImage src={user.profilePicture} />}
                  <AvatarFallback>
                    <User className="text-black" />
                  </AvatarFallback>
                </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.username}</h4>
                  </div>
                </div>
                <Button onClick={logoutHandler} className="cursor-pointer">Logout</Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center gap-4 py-4 md:hidden z-10">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Resume Analysis
          </Link>
          <Link to="/learning-path" onClick={() => setMenuOpen(false)}>
            Learning Path
          </Link>
          <Link to="/success-stories" onClick={() => setMenuOpen(false)}>
            Success Stories
          </Link>

          {!user ? (
            <div className="space-x-4">
            <Button
            className="bg-blue-500 px-6 cursor-pointer hover:bg-blue-600"
            onClick={() => {
              setMenuOpen(false);
              clickHandler();
            }}
            >
              Sign Up
            </Button>
            <Button className="w-20 cursor-pointer" 
              onClick={() => {              
                setMenuOpen(false);
                redirectToLogin();
              }}
            >
                Login
              </Button>
          </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {user?.profilePicture && <AvatarImage src={user.profilePicture} />}
                  <AvatarFallback>
                    <User className="text-black" />
                  </AvatarFallback>
                </Avatar>
                <span>{user.username}</span>
              </div>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  logoutHandler();
                  setMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;