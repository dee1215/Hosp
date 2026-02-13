import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="page">
      <Sidebar />
      <div className="page-wrapper">
        <Navbar />
        <div className="page-body container-xl">{children}</div>
      </div>
    </div>
  );
}
