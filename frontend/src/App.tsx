import { Toaster } from "@/components/ui/sonner"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/register',
    element: <Register />
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
