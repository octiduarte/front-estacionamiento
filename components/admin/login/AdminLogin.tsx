"use client";

import { useEffect } from "react";
import { useAdminDashboardAuth } from "@/hooks/admin/dashboard/useAdminDashboardAuth";
import { useAdminForm } from "@/hooks/admin/login/useAdminForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { loginAdmin } from "@/lib/admin/login/loginAdmin";
import { toast } from "sonner";

export default function AdminLogin() {

  const { form, setError, error, handleChange } = useAdminForm();
  const { loginSuccess } = useAdminDashboardAuth();

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
    toast.success("Accesso effettuato con successo");
    loginSuccess(token);
  }
}, [isSuccess]);

useEffect(() => {
  if (isError) {
    if (queryError?.message?.includes("401")) {
      toast.error("Credenziali non valide");
    } else {
      toast.error(queryError?.message);
    }
  }
}, [isError, queryError]); // 


  // Redirigir si ya hay token válido
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        loginSuccess(token);
      }
    }
  }, [loginSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    refetch();
  };


  return (
    <div className="flex flex-1  items-center justify-center h-[calc(100vh-8rem)] bg-gradient-to-b from-muted via-black to-muted">
      <div className="container mx-auto  py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="max-w-sm w-full mx-auto">
            <CardHeader>
              <CardTitle>Accesso Amministratore</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Nome utente</Label>
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
                    <Label htmlFor="password">Password</Label>
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
                  {isFetching ? "Caricamento..." : "Accedi"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
