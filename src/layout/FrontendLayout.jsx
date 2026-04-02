import { Outlet } from "react-router-dom";
import FrontendHeader from "../components/layout/FrontendHeader";
import FrontendFooter from "../components/layout/FrontendFooter";

const FrontendLayout = () => {
  return (
    <>
      <FrontendHeader />
      <main style={{ minHeight: "calc(100vh - 120px)" }}>
        <Outlet />
      </main>
      <FrontendFooter />
    </>
  );
};

export default FrontendLayout;
