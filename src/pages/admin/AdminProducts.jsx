import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";
import ProductList from "../../components/admin/ProductList";
import ProductModal from "../../components/admin/ProductModal";
import { useDispatch } from "react-redux";
import { addMessage } from "../../store/slices/messageSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPageInfo(response.data.pagination);
    } catch (error) {
      dispatch(
        addMessage({
          type: "danger",
          title: "取得商品失敗",
          text: `請重新整理頁面! ${error.message || ""}`,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (e, page) => {
    e.preventDefault();
    fetchProducts(page);
  };

  const openAddProductModal = () => {
    setSelectedProduct({
      category: "",
      content: "",
      description: "",
      id: "",
      imageUrl: "",
      imagesUrl: [],
      is_enabled: 0,
      origin_price: 0,
      price: 0,
      title: "",
      unit: "",
      num: 0,
    });
  };

  const deleteProduct = async (targetId, title) => {
    try {
      const result = await Swal.fire({
        title: `確定要刪除商品 "${title}" 嗎?`,
        text: `刪除後將無法復原`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#949494",
        confirmButtonText: "刪除",
        cancelButtonText: "取消",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${API_BASE}/api/${API_PATH}/admin/product/${targetId}`,
        );
        dispatch(
          addMessage({
            type: "success",
            title: "刪除成功",
          }),
        );
        fetchProducts();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "操作失敗";
      dispatch(
        addMessage({
          type: "danger",
          title: "刪除失敗",
          text: `請稍後重試! ${errorMsg}`,
        }),
      );
    }
  };

  return (
    <div className="admin-products">
      {/* 標題 */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-start align-items-center">
          <h2 className="h3 mb-0 me-3">商品列表</h2>
          <button
            className="btn-sm btn-action d-flex align-items-center pe-3"
            onClick={openAddProductModal}
          >
            <Plus size={16} className="me-1" />
            新增商品
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <ProductList
        products={products}
        setTempProduct={setSelectedProduct}
        deleteProduct={deleteProduct}
        pageInfo={pageInfo}
        handlePageChange={handlePageChange}
        loading={loading}
      />

      {/* Modal */}
      <ProductModal
        isOpen={!!selectedProduct}
        tempProduct={selectedProduct || {}}
        setTempProduct={setSelectedProduct}
        getData={fetchProducts}
      />
    </div>
  );
}

export default AdminProducts;
