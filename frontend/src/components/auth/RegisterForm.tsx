import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, UserRound, Loader2, CheckCircle, XCircle } from "lucide-react"; 
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner"; 
import { useNavigate } from 'react-router-dom';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    if (!profilePicture) {
      setProfilePicturePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePicture);
    setProfilePicturePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePicture]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters.";
      isValid = false;
    }
    if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    } else {
      setProfilePicture(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('password', password); 
        if (profilePicture) {
          formData.append('profilePicture', profilePicture, profilePicture.name);
        }

        console.log("Form data to be sent:", { 
          username, 
          fullName,
          email, 
          profilePicture: profilePicture ? profilePicture.name : 'No picture uploaded' 
        });


        const response = await axios.post(
        "",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(`Upload Success: ${response}`);
      if (response.status === 201) {
        toast.success("User Registered Successfully", {
          icon: <CheckCircle className="text-green-600 w-5 h-5" />,
        });
        navigate("/login");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Some error occurred";
      toast.error(message, {
        icon: <XCircle className="text-red-600 w-5 h-5" />,
      });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please correct the errors in the form.");
      console.log("Form validation failed", errors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row bg-white shadow-2xl overflow-hidden rounded-xl md:rounded-l-xl md:rounded-r-none">

          <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-cyan-400 text-white p-8 sm:p-12 flex flex-col items-center justify-center text-center rounded-t-xl md:rounded-tr-none md:rounded-l-xl">

            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
              alt="Company Logo" 
              className="w-24 h-24 mb-6 rounded-full object-cover" 
            />
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 ">Join Us</h2>
            <ChevronDown className="w-10 h-10 mb-4 text-white" />
            <p className="text-sm sm:text-base mb-8">
              Register to our amazing platform and unlock exclusive content and features.
            </p>
            <Button variant="outline" className="bg-white text-black cursor-pointer hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-sm sm:text-base">
              About Us
            </Button>
          </div>

          <div className="w-full md:w-3/5 bg-white p-8 sm:p-12 md:rounded-r-xl md:rounded-l-none rounded-b-xl relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">Register Here</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <Label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2 text-center">Profile Picture (Optional)</Label>
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="w-28 h-28 border-2 border-gray-200">
                    <AvatarImage src={profilePicturePreview || undefined} alt="Profile Preview" />
                    <AvatarFallback>
                      <UserRound className="w-14 h-14 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <Input 
                    id="profilePicture" 
                    type="file" 
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold cursor-pointer"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  placeholder="Your Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-customOrange focus:border-customOrange`}
                  disabled={isLoading}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Choose a Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-customOrange focus:border-customOrange`}
                  disabled={isLoading}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-customOrange focus:border-customOrange`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-customOrange focus:border-customOrange`}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full font-semibold py-3 px-4 rounded-lg text-sm sm:text-base flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
