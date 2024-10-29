import { createBrowserRouter } from "react-router-dom"
import { ErrorPage } from "./pages/error"

import Admin from "./pages/admin/admin"
import Home from "./pages/Home/home"
import Login from "./pages/login/login"
import Networks from "./pages/networks/metworks"

import Private from "./routes/Private"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/admin",
    element: <Private> <Admin/> </Private>
  },
  {
    path: "/admin/social",
    element: <Private> <Networks/> </Private>
  },
  {
    path: "*",
    element: <ErrorPage/>
  }
])

export { router };