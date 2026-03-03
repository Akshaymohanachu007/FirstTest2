// src/layouts/RootLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import CategoryScrollingbar from "../components/CategoryScrollingbar";

export default function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <CategoryScrollingbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}