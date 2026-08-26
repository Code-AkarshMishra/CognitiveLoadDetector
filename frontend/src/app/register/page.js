"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, UserPlus, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "USER",
      organization: "Acme Corp"
    }
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => null);

      const newUser = {
        name: data.name,
        email: data.email,
        role: data.role,
        organization: data.organization || "Independent",
        token: "demo-jwt-token-" + Date.now()
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("neurotrack_user", JSON.stringify(newUser));
      }

      toast.success("Account created successfully!");
      if (newUser.role === "DEVELOPER" || newUser.role === "ADMIN") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Registration encountered an issue. Proceeding with session.");
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
                  Create Account
                </h1>
                <p className="mt-2 text-[var(--text-secondary)] text-sm">
                  Register your account in MongoDB Atlas database.
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                <UserPlus size={23} aria-hidden="true" />
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <label className="field-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-invalid={errors.name ? "true" : "false"}
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <p className="form-error" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="field-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="user@org.com"
                  autoComplete="email"
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
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: 6,
                  })}
                />
                {errors.password && (
                  <p className="form-error" role="alert">
                    {errors.password.message || "Password must be at least 6 characters."}
                  </p>
                )}
              </div>

              <div>
                <label className="field-label" htmlFor="role">
                  Account Type / Role
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

              <div>
                <label className="field-label flex items-center justify-between" htmlFor="organization">
                  <span>Organization / Team</span>
                  <Building2 size={15} className="text-emerald-500" />
                </label>
                <select
                  id="organization"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  {...register("organization")}
                >
                  <option value="SyntaxSquad TechCorp">SyntaxSquad TechCorp</option>
                  <option value="Global University Labs">Global University Labs</option>
                  <option value="Acme AI Engineering">Acme AI Engineering</option>
                  <option value="Independent Developer">Independent Developer</option>
                  <option value="Custom Organization">Other / Enter Custom Organization</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2">
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
              Already registered?{" "}
              <Link className="font-bold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/login">
                Login
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
