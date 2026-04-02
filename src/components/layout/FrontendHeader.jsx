import { NavLink } from "react-router-dom";

const FrontendHeader = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm"
      style={{ borderBottom: "2px solid #ff758c" }}
    >
      <div className="container">
        <NavLink
          className="navbar-brand fw-bold"
          to="/"
          style={{ color: "#ff758c" }}
        >
          愛哆啦手作商城
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#frontNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="frontNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                首頁
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                產品列表
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">
                購物車
              </NavLink>
            </li>
          </ul>
          <NavLink
            to="/login"
            className="btn btn-outline-primary btn-sm rounded-pill px-4"
          >
            登入管理後台
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default FrontendHeader;
