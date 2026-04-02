import PropTypes from "prop-types";
import { Sparkles, LogOut } from "lucide-react";

const AdminHeader = ({ handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-4">
        <a className="navbar-brand d-flex align-items-center fw-bold" href="#">
          <Sparkles color="#ff758c" size={24} className="me-2" />
          後台管理
        </a>
        <button
          className="btn btn-outline-light btn-sm ms-auto d-flex align-items-center"
          onClick={handleLogout}
        >
          <LogOut size={18} className="me-2" />
          登出
        </button>
      </div>
    </nav>
  );
};

AdminHeader.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default AdminHeader;
