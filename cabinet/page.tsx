"use client";

import { useState, useEffect } from "react";
import { withAuth } from "@/lib/api";
import { motion } from "framer-motion";
import { Briefcase, Building2, ClipboardList, LayoutDashboard, Loader2, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Overview = {
  role: "CUSTOMER" | "CONTRACTOR" | "ADMIN";
  requestsTotal?: number;
  requestsActive?: number;
  companiesTotal?: number;
  servicesTotal?: number;
};

export default function CabinetPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("sm_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const client = withAuth(token);
      const response = await client.get<Overview>("/dashboard/overview");
      setData(response.data);
    } catch {
      setError("Не удалось загрузить кабинет. Проверьте токен и API.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("sm_token");
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-card sticky top-24 flex flex-col p-4">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                <UserIcon className="h-6 w-6 text-zinc-400" />
              </div>
              <div>
                <div className="font-medium text-white">Мой профиль</div>
                <div className="text-xs text-primary">{data?.role}</div>
              </div>
            </div>

            <nav className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-colors">
                <LayoutDashboard className="h-5 w-5" />
                Обзор
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white">
                <ClipboardList className="h-5 w-5" />
                Заявки
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white">
                <Building2 className="h-5 w-5" />
                Компании
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white">
                <Settings className="h-5 w-5" />
                Настройки
              </button>
            </nav>

            <div className="mt-auto pt-8">
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5" />
                Выйти
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-white">Обзор панели</h1>
            <button
              onClick={loadOverview}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Обновить данные
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {data && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <motion.article 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-card flex items-center gap-4 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <UserIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Тип аккаунта</p>
                  <p className="text-xl font-bold text-white">{data.role}</p>
                </div>
              </motion.article>

              <motion.article 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card flex items-center gap-4 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <ClipboardList className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Всего заявок</p>
                  <p className="text-2xl font-bold text-white">{data.requestsTotal ?? 0}</p>
                </div>
              </motion.article>

              <motion.article 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-card flex items-center gap-4 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                  <ClipboardList className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Активные заявки</p>
                  <p className="text-2xl font-bold text-white">{data.requestsActive ?? 0}</p>
                </div>
              </motion.article>

              <motion.article 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="glass-card flex items-center gap-4 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <Briefcase className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Услуги/Компании</p>
                  <p className="text-2xl font-bold text-white">
                    {(data.servicesTotal ?? 0) + (data.companiesTotal ?? 0)}
                  </p>
                </div>
              </motion.article>
            </div>
          )}
          
          <div className="mt-8 glass-card p-8 min-h-[300px] flex items-center justify-center flex-col text-center border-dashed">
            <ClipboardList className="h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-white">Недавние события</h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-sm">Здесь будет отображаться история ваших действий, новые заявки и сообщения от заказчиков.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
