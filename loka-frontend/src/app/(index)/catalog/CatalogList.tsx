"use client";

import React from "react";
import { itemsData } from "@/shared/data/items.data";
import { CatalogItem } from "./CatalogItem";

export function CatalogList() {
  return (
    <div className="relative pb-20">
      {/* Сетка с карточками */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsData.map((item) => (
          <CatalogItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      {/* Кнопка "Еще" */}
      <div className="text-center mt-12">
        <button className="bg-[#E88246] text-white font-semibold px-10 py-3 rounded-lg hover:bg-orange-600 transition-colors">
          Еще
        </button>
      </div>

      {/* Плавающая кнопка AI */}
      <button className="fixed bottom-8 right-8 bg-white w-16 h-16 rounded-full shadow-lg border-2 border-[#E88246] flex items-center justify-center text-[#E88246] font-bold text-2xl hover:bg-gray-50 transition-colors">
        AI
      </button>
    </div>
  );
}
