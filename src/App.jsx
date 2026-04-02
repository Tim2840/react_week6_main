import { RouterProvider } from "react-router-dom";
import { createRouter } from "./router";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.error("驗證失敗", error);
    } finally {
      // setIsAuthLoading(false); 已移除
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      checkLogin();
    }
  }, []);

  // 移除全域 Loading Spinner，改以非阻塞方式處理驗證 state，
  // 讓前端頁面的 Skeleton 能在第一時間呈現。
  const router = createRouter(isAuth, setIsAuth);
  return <RouterProvider router={router} />;
}

export default App;
