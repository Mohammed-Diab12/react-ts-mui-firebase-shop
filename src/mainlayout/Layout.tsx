import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
function Layout() {
  return (
    <>
    <ScrollToTop/>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
