import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ProductListSkeleton } from "../../components/common/Skeleton";
import { ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import { Oval } from "react-loader-spinner";

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
      Swal.fire({
        title: "已加入購物車",
        text: `商品已成功加入`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("加入購物車失敗", error);
      Swal.fire({
        title: "加入失敗",
        text: error.response?.data?.message || "請稍後再試",
        icon: "error",
      });
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
    <div className="product-list container mt-5">
      <div className="text-center mb-5 mt-4">
        <h1 className="fw-black mb-2 text-dark">精選亮點</h1>
        <div className="title-bar"></div>
        <p className="text-muted">為您挑選充滿溫度的手作禮物</p>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {isLoading ? (
          <ProductListSkeleton />
        ) : (
          products.map((product) => (
            <div className="col" key={product.id}>
              <div className="product-card card h-100 shadow-sm border-0">
                <div className="card-img-container">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.imageUrl}
                      className="card-img-top"
                      alt={product.title}
                    />
                  </Link>
                  <span className="category-badge">{product.category}</span>
                  <Link
                    to={`/product/${product.id}`}
                    className="btn-overlay text-decoration-none text-center"
                  >
                    查看細節
                  </Link>
                </div>
                <div className="card-body">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-decoration-none"
                  >
                    <h5 className="product-title" title={product.title}>
                      {product.title}
                    </h5>
                  </Link>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <div className="price-tag">
                      <span className="currency">NT$</span>
                      <span className="amount">
                        {product.price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="btn-add-cart"
                      onClick={() => addToCart(product.id)}
                      disabled={cartLoading[product.id]}
                      title="加入購物車"
                    >
                      {cartLoading[product.id] ? (
                        <Oval
                          height="20"
                          width="20"
                          color="#fff"
                          secondaryColor="#fff"
                          ariaLabel="oval-loading"
                          strokeWidth={4}
                          strokeWidthSecondary={4}
                        />
                      ) : (
                        <ShoppingCart size={22} />
                      )}
                    </button>
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
