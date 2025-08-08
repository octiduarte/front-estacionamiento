"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminDashboardAuth } from "@/hooks/admin/dashboard/useAdminDashboardAuth";
import { Calendar, Settings, Car, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { logout } = useAdminDashboardAuth();
  const pathname = usePathname();

  const navigation = [
    {
      name: "Prenotazioni",
      href: "/admin/dashboard/reservations",
      icon: Calendar,
    },
    {
      name: "Configurazione Veicoli",
      href: "/admin/dashboard/config",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Sidebar vertical para desktop */}
      <div className="hidden md:block w-64 bg-gradient-to-b from-black to-black/90">
        <div className="flex items-center px-6 py-4 border-b">
          <Car className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl">Admin Dashboard</span>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-primary/5 text-primary border-r-2 border-primary"
                    : "hover:bg-muted hover:text-white text-muted-foreground/50"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="w-full flex items-center px-6 py-3 text-sm text-left text-destructive hover:bg-destructive/5 transition-colors mt-8"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Esci
          </button>
        </nav>
      </div>
      {/* Sidebar inferior para mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-black/90 shadow-lg flex md:hidden">
        {navigation.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-muted hover:text-white text-muted-foreground/50"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex-1 flex flex-col items-center justify-center py-2 text-xs text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-5 w-5 mb-1" />
          Esci
        </button>
      </nav>
    </>
  );
}
