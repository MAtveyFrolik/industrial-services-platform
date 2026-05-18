"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Factory, Loader2, Lock, Mail, User, ShieldCheck } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string()
    .min(8, "Минимум 8 символов")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Пароль должен содержать строчные и заглавные буквы, цифры и спецсимволы"),
  confirmPassword: z.string().min(8, "Минимум 8 символов"),
  role: z.enum(["CUSTOMER", "CONTRACTOR"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    setSuccess(false);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role || "CUSTOMER",
      };
      await api.post("/auth/signup", payload);
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; errors?: { field?: string; messages?: string[] }[] } } })?.response?.data;
      if (message?.errors?.length) {
        setError(message.errors[0]?.messages?.join(", ") || "Ошибка валидации");
      } else if (typeof message?.message === "string") {
        setError(message.message);
      } else {
        setError("Не удалось зарегистрироваться.");
      }
    }
  });

  const selectedRole = form.watch("role");

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Factory className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Регистрация
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-hover hover:underline transition-colors"
            >
              Войти
            </Link>
          </p>
        </div>

        {success && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center">
            <p className="text-sm text-green-400">
              Регистрация прошла успешно! Вы можете войти.
            </p>
          </div>
        )}

        <form className="glass-card mt-8 space-y-6 p-8" onSubmit={onSubmit}>
          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Тип аккаунта
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => form.setValue("role", "CUSTOMER")}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  selectedRole === "CUSTOMER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Заказчик
              </button>
              <button
                type="button"
                onClick={() => form.setValue("role", "CONTRACTOR")}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  selectedRole === "CONTRACTOR"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                <Factory className="h-4 w-4" />
                Исполнитель
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Имя / Название компании
              </label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  className="block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 py-3 pl-10 pr-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="Иванов Иван или ООО «Компания»"
                  {...form.register("name")}
                />
              </div>
              {form.formState.errors.name && (
                <p className="mt-2 text-sm text-red-400">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Email адрес
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  className="block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 py-3 pl-10 pr-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="name@company.com"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Пароль
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  className="block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 py-3 pl-10 pr-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="••••••••"
                  {...form.register("password")}
                />
              </div>
              {form.formState.errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Подтвердите пароль
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  className="block w-full rounded-xl border border-zinc-700 bg-zinc-900/50 py-3 pl-10 pr-3 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="••••••••"
                  {...form.register("confirmPassword")}
                />
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 p-3 border border-red-500/20">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="group relative flex w-full justify-center rounded-xl bg-primary px-3 py-3.5 text-sm font-medium text-white transition-all hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,88,12,0.3)]"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Создать аккаунт
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>

          <p className="text-center text-xs text-zinc-500">
            Нажимая «Создать аккаунт», вы принимаете условия использования
            платформы PromZona.
          </p>
        </form>
      </motion.div>
    </main>
  );
}