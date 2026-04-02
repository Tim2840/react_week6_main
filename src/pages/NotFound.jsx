import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <p className="h3 mb-4">抱歉，找不到您要找的頁面</p>
      <Link to="/" className="btn btn-primary rounded-pill px-4">
        回到首頁
      </Link>
    </div>
  );
};

export default NotFound;
