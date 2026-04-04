import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, LogIn } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

function LoginPage({ isAuth, setIsAuth, getData }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (isAuth) {
      navigate("/admin/product");
    }
  }, [isAuth, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, data);
      const { token, expired } = response.data;

      document.cookie = `hexToken=${token};expires=${new Date(expired)}`;
      axios.defaults.headers.common["Authorization"] = token;

      setIsAuth(true);
      navigate("/admin/product");

      if (getData) getData();

      Swal.fire({
        icon: "success",
        title: "登入成功",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: error.response?.data?.message || "請重新輸入帳號密碼!",
      });
    }
  };

  return (
    <main className="login-page">
      <section className="auth-card">
        <header className="auth-header">
          <Link to="/" className="text-decoration-none">
            <h2 className="text-dark hover-primary mb-0">
              愛哆啦也愛<span className="text-accent">手作</span>
              <Sparkles color="#ff758c" className="ms-2" />
            </h2>
          </Link>
          <p>請輸入你的帳號密碼</p>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              id="username"
              placeholder="name@example.com"
              {...register("username", {
                required: "請輸入帳號 (Email)",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email 格式不正確",
                },
              })}
            />
            <label htmlFor="username">Email address</label>
            <Mail className="input-icon" size={20} />
            {errors.username && (
              <div className="invalid-feedback text-start">
                {errors.username.message}
              </div>
            )}
          </div>
          <div className="form-floating">
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Password"
              {...register("password", {
                required: "請輸入密碼",
              })}
            />
            <label htmlFor="password">Password</label>
            <Lock className="input-icon" size={20} />
            {errors.password && (
              <div className="invalid-feedback text-start">
                {errors.password.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-4 d-flex align-items-center justify-content-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                登入中...
              </>
            ) : (
              <>
                <LogIn size={20} className="me-2" /> 登入
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}

LoginPage.propTypes = {
  isAuth: PropTypes.bool,
  setIsAuth: PropTypes.func.isRequired,
  getData: PropTypes.func,
};

export default LoginPage;
