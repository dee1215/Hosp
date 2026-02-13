import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="modern-layout">
      <Sidebar />
      <div className="layout-wrapper">
        <Navbar />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
