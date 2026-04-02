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

  const [cartLoading, setCartLoading] = useState(false);
  const [qty, setQty] = useState(1);

  const addToCart = async () => {
    setCartLoading(true);
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: {
          product_id: id,
          qty: Number(qty),
        },
      });
      // 可以考慮跳通知或導向購物車
    } catch (error) {
      console.error("加入購物車失敗", error);
      alert("加入購物車失敗");
    } finally {
      setCartLoading(false);
    }
  };

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
              className="img-fluid rounded shadow-sm border"
            />
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3">
              <h2 className="fw-bold mb-0 me-3">{product.title}</h2>
              <span className="badge bg-primary px-3 py-2 rounded-pill">
                {product.category}
              </span>
            </div>
            <p className="text-muted mb-4 lead">{product.content}</p>
            <div className="h3 text-primary mb-5 fw-bold">
              NT$ {product.price}
            </div>

            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="input-group"
                style={{ width: "150px" }}
              >
                <select
                  className="form-select border-0 bg-light rounded-pill px-4"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  disabled={cartLoading}
                >
                  {[...Array(10).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary btn-lg rounded-pill px-5 flex-grow-1 d-flex align-items-center justify-content-center"
                onClick={addToCart}
                disabled={cartLoading}
              >
                {cartLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    處理中...
                  </>
                ) : (
                  "加入購物車"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
