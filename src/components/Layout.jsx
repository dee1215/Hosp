import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="page">
      <Sidebar />
      <div className="page-wrapper">
        <Navbar />
        <div className="page-body container-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
