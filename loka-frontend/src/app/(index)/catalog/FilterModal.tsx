"use client";

import React from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="py-4 border-b border-gray-200">
    <h3 className="font-semibold text-lg mb-3">{title}</h3>
    {children}
  </div>
);

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  // Состояние фильтра "Вид из окон" по умолчанию
  const [windowView, setWindowView] = React.useState("no-matter");
  // Состояние фильтра "Парковка" по умолчанию
  const [parking, setParking] = React.useState("no-matter");

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4"
      onClick={onClose} // Закрытие по клику на фон
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Предотвращение закрытия при клике на само окно
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Фильтры</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <FilterSection title="Ценовой диапазон, ₽">
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="от"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="до"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </FilterSection>

          <FilterSection title="Площадь, м²">
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="от"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="до"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </FilterSection>

          <FilterSection title="Ремонт и отделка">
            <select className="w-full p-2 border border-gray-300 rounded-lg bg-white">
              <option>Неважно</option>
              <option>Без ремонта</option>
              <option>Косметический</option>
              <option>Евро</option>
              <option>Дизайнерский</option>
            </select>
          </FilterSection>

          <FilterSection title="Вид из окон">
            <div className="flex gap-3">
              <button
                onClick={() => setWindowView("no-matter")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  windowView === "no-matter"
                    ? "border-[#E88246] bg-[#E88246] text-white"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}>
                Неважно
              </button>
              <button
                onClick={() => setWindowView("street")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  windowView === "street"
                    ? "border-[#E88246] bg-[#E88246] text-white"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}>
                На цлицу
              </button>
              <button
                onClick={() => setWindowView("yard")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  windowView === "yard"
                    ? "border-[#E88246] bg-[#E88246] text-white"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}>
                Во двор
              </button>
            </div>
          </FilterSection>

          <FilterSection title="Парковка">
            <div className="flex gap-3">
              <button
                onClick={() => setParking("no-matter")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  parking === "no-matter"
                    ? "border-[#E88246] bg-[#E88246] text-white"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}>
                Неважно
              </button>
              <button
                onClick={() => setParking("none")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  parking === "none"
                    ? "border-[#E88246] bg-[#E88246] text-white"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}>
                Нет
              </button>
              <button
                onClick={() => setParking("aboveground")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  parking === "aboveground"
                    ? "border-[#E88246] bg-[#E88246] text-white"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}>
                Надземная
              </button>
              <button
                onClick={() => setParking("underground")}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  parking === "underground"
                    ? "border-[#E88246] bg-[#E88246] text-white"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}>
                Подземная
              </button>
            </div>
          </FilterSection>
        </div>

        <div className="flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button className="text-sm text-gray-600 hover:text-black px-4 py-2">
            Сбросить
          </button>
          <button className="bg-[#E88246] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#ffa570] transition-colors">
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}
