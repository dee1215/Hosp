import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="modern-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="layout-wrapper">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
