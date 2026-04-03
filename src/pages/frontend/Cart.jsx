import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { CartSkeleton } from "../../components/common/Skeleton";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Cart = () => {
  const [cartData, setCartData] = useState({
    carts: [],
  });
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [itemLoadingMap, setItemLoadingMap] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      tel: "",
      address: "",
      message: "",
    },
    mode: "onTouched",
  });

  const getCart = async () => {
    setIsPageLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCartData(res.data.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "取得購物車失敗",
        text: "請稍後再試",
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  const updateCartItem = async (item, qty) => {
    setItemLoadingMap((prev) => ({ ...prev, [item.id]: true }));
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${item.id}`, {
        data: {
          product_id: item.product_id,
          qty,
        },
      });
      getCart();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "更新數量失敗" });
    } finally {
      setItemLoadingMap((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const removeCartItem = async (id) => {
    setItemLoadingMap((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      getCart();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "刪除品項失敗" });
    } finally {
      setItemLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const removeAllCart = async () => {
    setIsPageLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/all`);
      getCart();
      Swal.fire({ icon: "success", title: "已清空購物車", toast: true, position: "top-end", timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "清空失敗" });
    } finally {
      setIsPageLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const { message, ...user } = data;
    const orderData = {
      data: {
        user,
        message,
      },
    };

    try {
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/order`,
        orderData,
      );
      Swal.fire({
        icon: "success",
        title: "訂單送出成功",
        text: `訂單 ID: ${res.data.orderId}`,
      });
      reset();
      getCart();
    } catch (error) {
      console.error("送出訂單失敗", error);
      Swal.fire({
        icon: "error",
        title: "訂單送出失敗",
        text: error.response?.data?.message || "請稍後再試",
      });
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <h1 className="mb-0">購物車</h1>
        {cartData.carts.length > 0 && (
          <button
            className="btn btn-outline-danger btn-sm"
            type="button"
            onClick={removeAllCart}
            disabled={isPageLoading || Object.values(itemLoadingMap).some(v => v)}
          >
            清空購物車
          </button>
        )}
      </div>

      {isPageLoading && cartData.carts.length === 0 ? (
        <CartSkeleton />
      ) : cartData.carts.length > 0 ? (
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>品項</th>
                    <th style={{ width: "120px" }}>數量</th>
                    <th className="text-end">單價</th>
                    <th className="text-end">小計</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cartData.carts.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className="rounded-2 object-fit-cover me-3"
                            style={{ width: "60px", height: "60px" }}
                          />
                          <div>
                            <div className="fw-bold text-dark">{item.product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select
                          className="form-select border-0 bg-light rounded-pill px-3 py-1"
                          value={item.qty}
                          onChange={(e) => updateCartItem(item, Number(e.target.value))}
                          disabled={itemLoadingMap[item.id]}
                        >
                          {[...Array(20).keys()].map((i) => (
                            <option value={i + 1} key={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="text-end text-muted small">
                        NT$ {item.product.price}
                      </td>
                      <td className="text-end fw-bold text-primary">
                        NT$ {Math.round(item.total)}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-danger p-1"
                          onClick={() => removeCartItem(item.id)}
                          disabled={itemLoadingMap[item.id]}
                        >
                          {itemLoadingMap[item.id] ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <i className="bi bi-trash3"></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "2rem" }}>
              <h5 className="fw-bold mb-4">訂單摘要</h5>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>商品共 {cartData.carts.length} 項</span>
                <span>NT$ {Math.round(cartData.total)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="h5 fw-bold">總計</span>
                <span className="h5 fw-bold text-primary">NT$ {Math.round(cartData.final_total)}</span>
              </div>

              <div className="mt-4">
                <h6 className="fw-bold mb-3 border-start border-primary border-4 ps-2">收件人資訊</h6>
                <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                  <div className="col-12">
                    <input
                      type="email"
                      className={`form-control border-0 bg-light rounded-3 ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Email *"
                      {...register("email", {
                        required: "必填",
                        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "格式不正確" }
                      })}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className={`form-control border-0 bg-light rounded-3 ${errors.name ? "is-invalid" : ""}`}
                      placeholder="姓名 *"
                      {...register("name", { required: "必填" })}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="tel"
                      className={`form-control border-0 bg-light rounded-3 ${errors.tel ? "is-invalid" : ""}`}
                      placeholder="電話 *"
                      {...register("tel", {
                        required: "必填",
                        minLength: { value: 8, message: "最少 8 碼" },
                        pattern: { value: /^(09)[0-9]{8}$|^0[0-9]{1,2}[0-9]{6,8}$/, message: "格式不正確" }
                      })}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className={`form-control border-0 bg-light rounded-3 ${errors.address ? "is-invalid" : ""}`}
                      placeholder="地址 *"
                      {...register("address", { required: "必填" })}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control border-0 bg-light rounded-3"
                      rows="2"
                      placeholder="備註"
                      {...register("message")}
                    ></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
                      disabled={isSubmitting || cartData.carts.length === 0}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      ) : "確認送出訂單"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-light p-5 rounded-4 text-center border border-dashed">
          <p className="lead mb-4 text-muted">您的購物車目前是空的</p>
          <a href="#/product" className="btn btn-primary rounded-pill px-5">去商店逛逛</a>
        </div>
      )}
    </div>
  );
};

export default Cart;
