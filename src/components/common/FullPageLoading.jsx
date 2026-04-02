import { TailSpin } from "react-loader-spinner";
import PropTypes from "prop-types";

const FullPageLoading = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        transition: "opacity 0.3s ease",
      }}
    >
      <div className="text-center">
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
        <p className="mt-3 fw-bold text-dark">處理中，請稍候...</p>
      </div>
    </div>
  );
};

FullPageLoading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default FullPageLoading;
