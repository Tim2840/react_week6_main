import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ProductListSkeleton } from "../../components/common/Skeleton";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cartLoading, setCartLoading] = useState({});

  const addToCart = async (productId) => {
    setCartLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: {
          product_id: productId,
          qty: 1,
        },
      });
      // 可以考慮跳通知
    } catch (error) {
      console.error("加入購物車失敗", error);
      alert("加入購物車失敗");
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
        setProducts(res.data.products);
      } catch (error) {
        console.error("取得產品列表失敗", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">產品列表</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {isLoading ? (
          <ProductListSkeleton />
        ) : (
          products.map((product) => (
            <div className="col" key={product.id}>
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <img
                  src={product.imageUrl}
                  className="card-img-top object-fit-cover"
                  style={{ height: "200px" }}
                  alt={product.title}
                />
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-dark mb-0">
                      {product.title}
                    </h5>
                    <span className="badge bg-light text-primary rounded-pill border">
                      {product.category}
                    </span>
                  </div>
                  <p
                    className="card-text text-muted mb-4 text-truncate-2 small"
                    style={{ height: "3em" }}
                  >
                    {product.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="h5 text-primary mb-0 fw-bold">
                      NT$ {product.price}
                    </span>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                      >
                        細節
                      </Link>
                      <button
                        className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center"
                        onClick={() => addToCart(product.id)}
                        disabled={cartLoading[product.id]}
                      >
                        {cartLoading[product.id] ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          ></span>
                        ) : (
                          "加入購物車"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
