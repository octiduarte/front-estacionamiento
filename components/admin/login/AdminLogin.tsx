"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminForm } from "@/hooks/admin/login/useAdminForm";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Wheel from "@/components/ui/wheel";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { loginAdmin } from "@/lib/admin/login/loginAdmin";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();
 
  const t = useTranslations("Admin.login");
  const { form, setError, error, handleChange } = useAdminForm();

  const {
    data: token,
    isSuccess,
    isError,
    error: queryError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["adminLogin", form.username, form.password],
    queryFn: async () => {
      const token = await loginAdmin(form.username, form.password);
      return token;
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("admin_token", token);
      router.push("/admin/dashboard");
    }
    if (isError) {
      if (queryError?.message === "401") {
        toast.error(t("invalidCredentials"));
      } else {
        toast.error(queryError?.message);
      }
    }
  }, [isSuccess, isError, token, queryError, t, router]);


   // Redirigir si ya hay token válido
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        router.replace("/admin/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    refetch();
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Wheel />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-muted via-black to-muted">
      <div className="container mx-auto  py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="max-w-sm w-full mx-auto">
            <CardHeader>
              <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">{t("username")}</Label>
                    <Input
                      id="username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      autoComplete="username"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">{t("password")}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button type="submit" className="w-full" disabled={isFetching}>
                  {isFetching ? t("loading") : t("login")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
