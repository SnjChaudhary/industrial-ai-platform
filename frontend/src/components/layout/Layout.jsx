import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden 
bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#0a0f1c] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">

          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Layout;
