import { createHashRouter, Navigate } from "react-router-dom";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./pages/frontend/Home";
import Products from "./pages/frontend/Products";
import SingleProduct from "./pages/frontend/SingleProduct";
import Cart from "./pages/frontend/Cart";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./layout/AdminLayout";

// 簡單的路由保護組件
const ProtectedRoute = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/login" replace />;
};

export const createRouter = (isAuth, setIsAuth) => createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage isAuth={isAuth} setIsAuth={setIsAuth} />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute isAuth={isAuth}>
        <AdminLayout setIsAuth={setIsAuth} />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
