"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  PieChart,
  Package,
  History,
  X,
  Menu,
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  icon: string;
  href: string;
  badge?: string;
}

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  className = "",
}: SidebarProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    router.push("/login");
  };

  const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: "chart", href: "/dashboard" },
    { title: "Reports", icon: "chart", href: "/reports" },
  ];

  const customerItems: MenuItem[] = [
    { title: "User List", icon: "package", href: "/userList" },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "chart":
        return <PieChart className="w-5 h-5" />;
      case "rotate":
        return <History className="w-5 h-5 text-red-500 animate-spin-slow" />;
      case "package":
        return <Package className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const MenuItemComponent = ({ item }: { item: MenuItem }) => {
    const isActive = pathname === item.href;

    return (
      <li className="mb-1">
       <Link
  href={item.href}
  onClick={() => setLocalIsOpen(false)} 
  className={`flex items-center group transition-all duration-200 rounded-md
    ${isCollapsed ? "flex-col justify-center py-3" : "flex-row px-3 py-2"}
    ${
      isActive
        ? "bg-gradient-to-r from-red-900/40 to-red-600/40 text-white font-semibold"
        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
    }`}
>
          <span
            className={`transition-all duration-200 ${
              isActive ? "text-rose-400" : "text-gray-400 group-hover:text-rose-300"
            }`}
          >
            {getIcon(item.icon)}
          </span>

          {isCollapsed ? (
            <span className="mt-1 text-xs">{item.title}</span>
          ) : (
            <span className="ml-3 text-[0.95rem]">{item.title}</span>
          )}

          {item.badge && (
            <span
              className={`bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full ${
                isCollapsed ? "mt-1" : "ml-auto"
              }`}
            >
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  const SectionHeader = ({ title }: { title: string }) =>
    !isCollapsed ? (
      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </div>
    ) : null;

  const Divider = () => <hr className="border-gray-700 my-2" />;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setLocalIsOpen(!localIsOpen)}
        className="sm:hidden fixed top-5 left-5 z-[2000] p-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition"
      >
        {localIsOpen ? (
          <X className="w-6 h-6 text-red-600" />
        ) : (
          <Menu className="w-6 h-6 text-red-600" />
        )}
      </button>

      {/* Overlay for Mobile */}
      {localIsOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/40 z-[1500]"
          onClick={() => setLocalIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div

  className={`fixed left-0 top-[6rem] bottom-0 text-white h-[calc(100vh-6rem)] flex flex-col relative 
  overflow-hidden sm:overflow-visible
  z-[1600] 
  ${
    localIsOpen
      ? "w-64 translate-x-0"
      : "w-0 -translate-x-full sm:translate-x-0"
  }
  ${isCollapsed ? "sm:w-24" : "sm:w-64"}
  transition-all duration-300 ease-in-out
  bg-gradient-to-b from-[#1f1f1f] to-[#2b2b2b]
  border-r border-gray-800 shadow-lg
  ${className}`}
>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <MenuItemComponent key={index} item={item} />
            ))}

            <Divider />
            <SectionHeader title="User" />
            {customerItems.map((item, index) => (
              <MenuItemComponent key={index} item={item} />
            ))}
          </ul>
        </nav>

        {/* Collapse Button (Desktop) */}
        <button
          onClick={toggleSidebar}
          className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 
            w-10 h-10 bg-red-600 hover:bg-rose-500 rounded-full items-center 
            justify-center shadow-md transition-all duration-300 hover:scale-105"
        >
          <ChevronLeft
            className={`w-5 h-5 text-white ${
              isCollapsed ? "rotate-180" : ""
            } transition-transform duration-300`}
          />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-red-600/20 
          transition-all duration-300 border-t border-gray-700"
        >
          <LogOut className="mr-2 h-5 w-5 text-red-500" />
          {!isCollapsed && <span className="text-[1rem] font-medium">Logout</span>}
        </button>
      </div>
    </>
  );
}
