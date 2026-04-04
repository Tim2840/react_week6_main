/* eslint-disable react/prop-types */
const Skeleton = ({ width, height, className = "", style = {} }) => {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{ width, height, ...style }}
    ></div>
  );
};

// --- 商品相關骨架 ---

export const ProductCardSkeleton = () => {
  return (
    <div className="card h-100 shadow-sm border-0">
      <Skeleton height="200px" className="card-img-top" />
      <div className="card-body">
        <Skeleton width="75%" height="1.25rem" className="mb-3" />
        <Skeleton width="100%" height="1rem" className="mb-1" />
        <Skeleton width="50%" height="1rem" className="mb-3" />
        <div className="d-flex justify-content-between align-items-center">
          <Skeleton width="25%" height="1.5rem" />
          <Skeleton width="25%" height="2rem" className="rounded-pill" />
        </div>
      </div>
    </div>
  );
};

export const ProductListSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="col" key={index}>
          <ProductCardSkeleton />
        </div>
      ))}
    </>
  );
};

// --- 購物車相關骨架 ---

// 單個購物車品項
export const CartItemSkeleton = () => {
  return (
    <div className="d-flex align-items-center mb-4">
      <Skeleton width="60px" height="60px" className="rounded-2 me-3" />
      <div className="flex-grow-1">
        <Skeleton width="40%" height="1.2rem" className="mb-2" />
        <Skeleton width="20%" height="1rem" />
      </div>
      <Skeleton width="80px" height="2rem" className="ms-auto" />
    </div>
  );
};

// 右側訂單摘要塊
export const CartSummarySkeleton = () => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <Skeleton width="50%" height="1.5rem" className="mb-4" />
      <Skeleton width="100%" height="1rem" className="mb-3" />
      <Skeleton width="100%" height="1rem" className="mb-3" />
      <hr />
      <Skeleton width="100%" height="2rem" className="mb-4" />
      <Skeleton width="100%" height="3rem" className="rounded-pill" />
    </div>
  );
};

// 完整的購物車頁面加載視圖
export const CartSkeleton = ({ count = 3 }) => {
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <div className="p-4">
            {Array.from({ length: count }).map((_, index) => (
              <CartItemSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <CartSummarySkeleton />
      </div>
    </div>
  );
};

export default Skeleton;
