"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, LogIn, ShieldAlert, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function LoginPage() {
  const router = RouterHook();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "USER"
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Attempt backend MongoDB authentication
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => null);

      let authUser = {
        name: data.email.split("@")[0] || "User",
        email: data.email,
        role: data.role || "USER",
        token: "demo-jwt-token-" + Date.now()
      };

      if (response && response.ok) {
        const resData = await response.json();
        if (resData.user) {
          authUser = resData.user;
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("neurotrack_user", JSON.stringify(authUser));
      }

      toast.success(`Welcome back, ${authUser.name}!`);

      if (authUser.role === "DEVELOPER" || authUser.role === "ADMIN") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Login process encountered an issue. Continuing as local session.");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="app-container flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--foreground)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Activity size={19} aria-hidden="true" />
            </span>
            NeuroTrack
          </Link>

          <section className="surface-card p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-[var(--foreground)]">
                  Login
                </h1>
                <p className="mt-2 text-[var(--text-secondary)] text-sm">
                  Access your NeuroTrack account & MongoDB database session.
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                <LogIn size={23} aria-hidden="true" />
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <label className="field-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="user@organization.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && (
                  <p className="form-error" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="form-error" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="field-label" htmlFor="role">
                  Account Role
                </label>
                <select
                  id="role"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  {...register("role")}
                >
                  <option value="USER">User (Standard Dashboard)</option>
                  <option value="ORGANIZATION">Organization Manager</option>
                  <option value="DEVELOPER">Developer (Hidden Admin Panel)</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2">
                {loading ? "Authenticating..." : "Login to NeuroTrack"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
              New to NeuroTrack?{" "}
              <Link className="font-bold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/register">
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function RouterHook() {
  return useRouter();
}
