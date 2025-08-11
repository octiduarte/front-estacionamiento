"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebarProvider } from "@/components/admin/dashboard/AdminSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <AdminSidebarProvider>
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex-1 overflow-x-auto bg-gradient-to-b from-black to-black/90 p-4">
          {children}
        </div>
      </SidebarInset>
    </AdminSidebarProvider>
  );
}

