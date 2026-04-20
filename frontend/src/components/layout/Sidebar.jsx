import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  ShieldCheck,
  FileText,
  User
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const links = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: ["admin", "engineer", "operator"],
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: Wrench,
      roles: ["admin", "engineer"],
    },
    {
      name: "Quality",
      path: "/quality",
      icon: ShieldCheck,
      roles: ["admin", "engineer"],
    },
    {
      name: "Hybrid",
      path: "/hybrid",
      icon: ShieldCheck,
      roles: ["admin", "engineer"],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
      roles: ["admin"],
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
      roles: ["admin", "engineer", "operator"],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0b1220] border-r border-white/10 flex flex-col">
      
      {/* Logo Section */}
      <div className="p-6 text-xl font-bold border-b border-white/10 text-blue-400 tracking-wide">
        AI Platform
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links
          .filter((link) => link.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                  transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "text-gray-300 hover:bg-blue-500/10 hover:text-white"
                  }`
                }
              >
                <Icon
                  size={18}
                  className="transition-all duration-300 group-hover:scale-110"
                />
                <span className="text-sm font-medium tracking-wide">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
      </nav>

      {/* Bottom Status */}
      <div className="p-4 border-t border-white/10 text-xs text-gray-400">
        System Status: <span className="text-green-400">● Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;