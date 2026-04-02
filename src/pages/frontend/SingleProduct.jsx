import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "../../components/common/Skeleton";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(res.data.product);
      } catch (error) {
        console.error("取得產品細節失敗", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="container mt-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        回產品列表
      </button>
      {isLoading ? (
        <div className="row">
          <div className="col-md-6">
            <Skeleton height="400px" className="rounded shadow-sm" />
          </div>
          <div className="col-md-6">
            <Skeleton width="75%" height="2.5rem" className="mb-3" />
            <div className="mb-3">
              <Skeleton width="25%" height="1.5rem" />
            </div>
            <Skeleton width="100%" height="1rem" className="mb-2" />
            <Skeleton width="100%" height="1rem" className="mb-2" />
            <Skeleton width="50%" height="1rem" className="mb-4" />
            <div className="h3 mb-4">
              <Skeleton width="50%" height="2rem" />
            </div>
            <Skeleton width="50%" height="3rem" className="rounded-pill" />
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">{product.title}</h2>
            <span className="badge bg-primary mb-3">{product.category}</span>
            <p className="text-muted mb-4">{product.content}</p>
            <div className="h3 text-primary mb-4">NT$ {product.price}</div>
            <button className="btn btn-primary btn-lg rounded-pill px-5">
              加入購物車
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
