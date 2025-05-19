import { Toaster } from "@/components/ui/sonner"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useDispatch } from 'react-redux';
import { logout, setUser } from './redux/authSlice';
import axios from 'axios';
import type { AppDispatch } from "./redux/store";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Redirect from "./pages/Redirect";
import CalculateATS from "./pages/CalculateATS";
import ProtectedRoute from "./components/ProtectedRoute";
import SkillAnalysis from "./pages/SkillAnalysis";
import AnalyseResume from "./pages/AnalyseResume";
import ResumeDetails from "./pages/ResumeAnalysis";
import OtpLoginForm from "./components/auth/LoginOtp";
import AboutUs from "./pages/About";

interface ServerResponse {
  message: string;
  user: {
    userId: string,
    username: string,
    email: string,
    profilePicture: string,
  };
  status: number;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/resume-analysis',
    element: <SkillAnalysis />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/login-otp',
    element: <OtpLoginForm />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/redirect',
    element: <Redirect />
  },
  {
    path: '/analyse-resume',
    element: (
      <ProtectedRoute>
        <AnalyseResume /> 
      </ProtectedRoute>
    )
  },
  {
    path: '/about-us',
    element: <AboutUs />
  },
  {
    path: '/analysis',
    element: <ResumeDetails />
  },
  {
    path: '/calculate-ats',
    element: (
      <ProtectedRoute>
        <CalculateATS />
      </ProtectedRoute>
    )
  },
  { 
    path: "*", 
    element: <NotFound /> 
  },
]);


function App() {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const validateUser = async () => {
      try {
        await axios.post<ServerResponse>('https://smartscan-production.up.railway.app/api/v1/users/getAccessToken', {}, {
          withCredentials: true
        });
        
        const res = await axios.get<ServerResponse>('https://smartscan-production.up.railway.app/api/v1/users/user', {
          withCredentials: true
        });

        dispatch(setUser(res.data.user));
      } catch (err) {
        dispatch(logout());
        localStorage.clear();
      }
    };

      validateUser();
  }, []);

  return (
    <>
      <RouterProvider router={router}/>
      <Toaster />
    </>
  )
}

export default App
