import { useState, useEffect } from "react";
import axios from "axios";
import { CartSkeleton } from "../../components/common/Skeleton";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Cart = () => {
  const [cartData, setCartData] = useState({
    carts: [],
  });
  const [isFullLoading, setIsFullLoading] = useState(false);

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
    // [你的任務]：
    // 1. 開啟 Loading 狀態
    // 2. 使用 axios.put 發送請求
    // 3. 成功後呼叫 getCart() 重新刷新 UI
    // 4. 關閉 Loading 狀態
    console.log("正在嘗試更新...", item.id, qty);
  };

  // TODO: 刪除單一購物車項目
  // 提示：API 網址為 `${API_BASE}/api/${API_PATH}/cart/${cart_id}`
  const removeCartItem = async (id) => {
    // [你的任務]：使用 axios.delete 並在成功後呼叫 getCart() 刷新購物車
    console.log("預計刪除項目的 ID:", id);
  };

  // TODO: 清空購物車
  // 提示：API 網址為 `${API_BASE}/api/${API_PATH}/cart/all`
  const removeAllCart = async () => {
    // [你的任務]：使用 axios.delete 並在成功後呼叫 getCart() 刷新購物車
    console.log("預計清空整個購物車");
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
              <div className="bg-light p-3 rounded-3 mb-4">
                <p className="small text-muted mb-0">
                  💡 提示：下一步可以嘗試實作顧客資訊表單與驗證！
                </p>
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

      {/* Loading Overlay 已移除，改用 Skeleton 提供更佳體驗 */}
    </div>
  );
};

export default Cart;
