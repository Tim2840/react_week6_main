import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ProductListSkeleton } from "../../components/common/Skeleton";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={product.imageUrl}
                  className="card-img-top object-fit-cover"
                  style={{ height: "200px" }}
                  alt={product.title}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold text-dark">
                    {product.title}
                  </h5>
                  <p
                    className="card-text text-muted mb-3 text-truncate-2"
                    style={{ height: "3em" }}
                  >
                    {product.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-primary mb-0">
                      NT$ {product.price}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                    >
                      查看細節
                    </Link>
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
