"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const t = useTranslations("Admin.Login");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Submit triggered"); // <-- Agrega esto
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      console.log("Response status:", res.status); // <-- Agrega esto
      if (res.ok) {
        console.log("Login successful");
        console.log("Pathname:", pathname);
        console.log("Locale:", locale);
        console.log("Redirecting to:", `/${locale}/admin/dashboard`);
        router.replace(`/${locale}/admin/dashboard`);
      }
    } catch (err) {
      console.log("Error:", err); // <-- Agrega esto
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  {error && <div className="text-destructive text-sm mt-2">{error}</div>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t("loading") : t("login")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
