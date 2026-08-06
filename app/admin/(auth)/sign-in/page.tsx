"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { AuthService, type AdminSignInPayload } from "@/lib/api/auth";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import { USE_MOCKS } from "@/lib/mock";
import { MOCK_PASSWORD } from "@/lib/mock/data";

const DEMO_ACCOUNTS = [
  { email: "admin@auntienana.com", role: "Super admin" },
  { email: "sales@auntienana.com", role: "Admin" },
];

export default function AdminSignInPage() {
  const router = useRouter();
  const { setAuth, token, _hasHydrated } = useAdminAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (_hasHydrated && token) router.replace("/admin");
  }, [_hasHydrated, token, router]);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  const mutation = useMutation({
    mutationFn: (payload: AdminSignInPayload) => AuthService.signIn(payload),
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 7 });
      setAuth(data.admin, data.token);
      toast.success(`Welcome back, ${data.admin.name.split(" ")[0]}.`);
      router.push("/admin");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        Admin
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Enter your details to manage the store.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Field>
          <FieldLabel className="text-gray-700">Email address</FieldLabel>
          <Input
            type="email"
            placeholder="you@auntienana.com"
            value={form.email}
            onChange={set("email")}
            required
            autoComplete="email"
            className="h-11"
          />
        </Field>

        <Field>
          <FieldLabel className="text-gray-700">Password</FieldLabel>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={set("password")}
              required
              autoComplete="current-password"
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mt-2 h-11 w-full rounded-xl text-sm font-semibold"
        >
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {USE_MOCKS && (
        <div className="mt-8 rounded-xl border border-dashed border-primary/30 bg-primary/4 p-4">
          <p className="text-xs font-semibold text-primary">
            Demo mode — no backend yet
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
            Tap an account to fill it in. The password isn&apos;t checked yet.
          </p>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {DEMO_ACCOUNTS.map((acct) => (
              <li
                key={acct.email}
                className="flex items-center justify-between gap-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    setForm({ email: acct.email, password: MOCK_PASSWORD })
                  }
                  className="font-mono text-xs text-primary hover:underline"
                >
                  {acct.email}
                </button>
                <span className="text-[10px] tracking-wide text-gray-400 uppercase">
                  {acct.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
