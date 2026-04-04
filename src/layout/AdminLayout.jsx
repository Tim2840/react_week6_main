import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/layout/AdminHeader";
import AdminFooter from "../components/layout/AdminFooter";
import Swal from "sweetalert2";

function AdminLayout({ setIsAuth }) {
  const handleLogout = () => {
    document.cookie = "hexToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsAuth(false);
    Swal.fire({
      icon: "success",
      title: "登出成功",
      timer: 1500,
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light admin-layout">
      <AdminHeader handleLogout={handleLogout} />

      <main className="container-fluid flex-grow-1 px-4 py-4">
        {/* 子路由內容將會渲染在這裡 */}
        <Outlet />
      </main>

      <AdminFooter />
    </div>
  );
}

AdminLayout.propTypes = {
  setIsAuth: PropTypes.func.isRequired,
};

export default AdminLayout;
