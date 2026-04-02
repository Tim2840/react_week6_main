import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { CartSkeleton } from "../../components/common/Skeleton";
import FullPageLoading from "../../components/common/FullPageLoading";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Cart = () => {
  const [cartData, setCartData] = useState({
    carts: [],
  });
  const [isFullLoading, setIsFullLoading] = useState(false);

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

  // 取得購物車資料 (範例：幫你寫好了！)
  const getCart = async () => {
    setIsFullLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCartData(res.data.data);
    } catch (error) {
      console.error(error);
      alert("取得購物車失敗");
    } finally {
      setIsFullLoading(false);
    }
  };

  // TODO: 更新購物車品項數量
  // 提示：API 網址為 `${API_BASE}/api/${API_PATH}/cart/${cart_id}`
  // 需要傳送 data 物件，格式為 { data: { product_id, qty } }
  const updateCartItem = async (item, qty) => {
    setIsFullLoading(true);
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
      alert("更新購物車失敗");
      setIsFullLoading(false);
    }
  };

  const removeCartItem = async (id) => {
    setIsFullLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      getCart();
    } catch (error) {
      console.error(error);
      alert("刪除品項失敗");
      setIsFullLoading(false);
    }
  };

  const removeAllCart = async () => {
    setIsFullLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/all`);
      getCart();
    } catch (error) {
      console.error(error);
      alert("清空購物車失敗");
      setIsFullLoading(false);
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

    setIsFullLoading(true);
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
    } finally {
      setIsFullLoading(false);
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
          >
            清空購物車
          </button>
        )}
      </div>

      {isFullLoading && cartData.carts.length === 0 ? (
        <CartSkeleton />
      ) : cartData.carts.length > 0 ? (
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>品項</th>
                    <th style={{ width: "150px" }}>數量</th>
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
                            <div className="fw-bold">{item.product.title}</div>
                            {item.coupon && (
                              <span className="badge bg-success">
                                已套用：{item.coupon.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="input-group input-group-sm">
                          <select
                            className="form-select border-0 bg-light rounded-pill px-3"
                            value={item.qty}
                            onChange={(e) =>
                              updateCartItem(item, Number(e.target.value))
                            }
                            disabled={isFullLoading}
                          >
                            {[...Array(20).keys()].map((i) => (
                              <option value={i + 1} key={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="text-end text-muted">
                        NT$ {item.product.price}
                      </td>
                      <td className="text-end fw-bold">
                        NT$ {Math.round(item.total)}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-danger p-1"
                          onClick={() => removeCartItem(item.id)}
                          disabled={isFullLoading}
                        >
                          <i className="bi bi-trash3"></i>
                          <span className="small">刪除</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm rounded-4 p-4 sticky-top"
              style={{ top: "2rem" }}
            >
              <h5 className="fw-bold mb-4">訂單摘要</h5>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">商品總計</span>
                <span className="fw-medium">
                  NT$ {Math.round(cartData.total)}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="h5 fw-bold mb-0">總計</span>
                <span className="h5 fw-bold mb-0 text-primary">
                  NT$ {Math.round(cartData.final_total)}
                </span>
              </div>

              {/* TODO: 這裡可以預留一個結帳表單的入口或是直接寫表單 */}
              {/* 結帳表單 */}
              <div className="mt-5">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <span className="text-white fw-bold small">1</span>
                  </div>
                  <h4 className="fw-bold mb-0">收件人資訊</h4>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                  <div className="col-md-6 text-start">
                    <label htmlFor="email" className="form-label small fw-bold">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-control border-0 bg-light rounded-3 ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="請輸入 Email"
                      {...register("email", {
                        required: "Email 為必填",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Email 格式不正確",
                        },
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 text-start">
                    <label htmlFor="name" className="form-label small fw-bold">
                      收件人姓名 <span className="text-danger">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`form-control border-0 bg-light rounded-3 ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="請輸入姓名"
                      {...register("name", { required: "姓名為必填" })}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-12 text-start">
                    <label htmlFor="tel" className="form-label small fw-bold">
                      收件人電話 <span className="text-danger">*</span>
                    </label>
                    <input
                      id="tel"
                      type="tel"
                      className={`form-control border-0 bg-light rounded-3 ${
                        errors.tel ? "is-invalid" : ""
                      }`}
                      placeholder="請輸入電話"
                      {...register("tel", {
                        required: "電話為必填",
                        minLength: { value: 8, message: "電話最少 8 碼" },
                        pattern: {
                          value: /^(09)[0-9]{8}$|^0[0-9]{1,2}[0-9]{6,8}$/,
                          message: "請輸入有效的電話格式",
                        },
                      })}
                    />
                    {errors.tel && (
                      <div className="invalid-feedback">{errors.tel.message}</div>
                    )}
                  </div>

                  <div className="col-md-12 text-start">
                    <label htmlFor="address" className="form-label small fw-bold">
                      收件地地址 <span className="text-danger">*</span>
                    </label>
                    <input
                      id="address"
                      type="text"
                      className={`form-control border-0 bg-light rounded-3 ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      placeholder="請輸入地址"
                      {...register("address", { required: "地址為必填" })}
                    />
                    {errors.address && (
                      <div className="invalid-feedback">
                        {errors.address.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-12 text-start">
                    <label htmlFor="message" className="form-label small fw-bold">
                      留言
                    </label>
                    <textarea
                      id="message"
                      className="form-control border-0 bg-light rounded-3"
                      rows="3"
                      placeholder="有什麼想對我們說的嗎？"
                      {...register("message")}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
                      disabled={isFullLoading || isSubmitting || cartData.carts.length === 0}
                    >
                      {isSubmitting || isFullLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          處理中...
                        </>
                      ) : (
                        "確認送出訂單"
                      )}
                    </button>
                    {cartData.carts.length === 0 && (
                      <p className="text-danger small mt-2 mb-0 text-center">
                        購物車內尚無品項，無法送出訂單
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-light p-5 rounded-4 text-center border border-dashed">
          <p className="lead mb-4 text-muted">您的購物車目前是空的</p>
          <a href="#/product" className="btn btn-primary rounded-pill px-5">
            去商店逛逛
          </a>
        </div>
      )}

      {/* Loading Overlay */}
      <FullPageLoading isLoading={isFullLoading} />
    </div>
  );
};

export default Cart;
