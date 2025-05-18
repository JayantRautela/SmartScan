import { Toaster } from "@/components/ui/sonner"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login";
import AnalyseResume from "./pages/AnalyseResume";

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
    element: <AnalyseResume />
  }
]);


function App() {


  return (
    <>
      <RouterProvider router={router}/>
      <Toaster />
    </>
  )
}

export default App
