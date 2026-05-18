"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Briefcase, Filter, Search } from "lucide-react";
import { useState } from "react";

const cards = [
  {
    id: "1",
    title: "СтальМонтаж Group",
    category: "Промышленный монтаж",
    city: "Москва",
    rating: "4.9",
    reviews: 124,
    description: "Проектирование и монтаж промышленных металлоконструкций любой сложности. СРО.",
  },
  {
    id: "2",
    title: "WeldTech",
    category: "Сварочные работы",
    city: "Екатеринбург",
    rating: "4.8",
    reviews: 89,
    description: "Сварка аргоном, полуавтоматом. Работаем с цветными металлами и нержавейкой.",
  },
  {
    id: "3",
    title: "CNC Factory",
    category: "Токарные и фрезерные работы",
    city: "Казань",
    rating: "4.7",
    reviews: 56,
    description: "Серийное производство деталей на станках с ЧПУ по чертежам заказчика.",
  },
  {
    id: "4",
    title: "СтройПром Инжиниринг",
    category: "Строительство",
    city: "Санкт-Петербург",
    rating: "4.9",
    reviews: 210,
    description: "Строительство цехов, ангаров, складов под ключ. Генеральный подряд.",
  }
];

const categories = [
  "Все категории",
  "Строительство",
  "Металлообработка",
  "Сварочные работы",
  "Производство",
  "Токарные и фрезерные работы",
  "Промышленный монтаж"
];

export default function CatalogPage() {
  const [activeCat, setActiveCat] = useState("Все категории");

  const filteredCards = activeCat === "Все категории" 
    ? cards 
    : cards.filter(c => c.category === activeCat || (activeCat === "Токарные и фрезерные работы" && c.category === "Токарные и фрезерные работы"));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white">Каталог исполнителей</h1>
        <p className="mt-2 text-zinc-400 text-lg">Найдите надежного подрядчика для вашего проекта</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="glass-card sticky top-24 p-6">
            <div className="flex items-center gap-2 mb-6 text-white">
              <Filter className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Фильтры</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-zinc-400">Поиск по названию</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-colors"
                    placeholder="Название компании..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-zinc-400">Категория</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                        activeCat === cat 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-zinc-400">Город</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-colors"
                    placeholder="Например: Москва"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Catalog Grid */}
        <div className="flex-1">
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredCards.map((card, idx) => (
              <motion.article 
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="glass-card flex flex-col p-6 transition-all hover:border-primary/50 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{card.title}</h2>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
                      <Briefcase className="h-4 w-4" />
                      <span>{card.category}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-sm font-semibold text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    <span>{card.rating}</span>
                  </div>
                </div>
                
                <p className="mt-2 flex-1 text-sm text-zinc-300 line-clamp-3">
                  {card.description}
                </p>
                
                <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
                  <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <MapPin className="h-4 w-4" />
                    <span>{card.city}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{card.reviews} отзывов</span>
                </div>
                
                <Link 
                  href={`/companies/${card.id}`}
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-zinc-800 py-2.5 font-medium text-white transition-all hover:bg-primary hover:text-white"
                >
                  Открыть профиль
                </Link>
              </motion.article>
            ))}
          </div>
          
          {filteredCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-xl font-semibold text-white">Ничего не найдено</h3>
              <p className="mt-2 text-zinc-400">Попробуйте изменить параметры фильтра</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
