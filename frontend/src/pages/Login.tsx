import LoginForm from "@/components/auth/LoginForm";
import logo from "../assets/logo.png";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 relative bg-gradient-to-b from-blue-600 to-blue-400 p-8 text-white flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
          <img 
            src={logo} 
            alt="Login" 
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
        <div className="animate-bounce my-4">
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
        <p className="text-center max-w-xs mx-auto mb-8">
          Sign in to your account to access exclusive content and features.
        </p>
        <a 
          href="/about"
          className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
        >
          About Us
        </a>
      </div>
      
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;