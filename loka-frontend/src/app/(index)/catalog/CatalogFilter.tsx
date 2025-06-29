"use client";

import React, { useState } from 'react';
import { FilterModal } from './FilterModal';

const FilterButton = ({ children }: { children: React.ReactNode }) => (
    <button className="bg-white border border-gray-300 rounded-lg px-6 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors">
        {children}
    </button>
);

export function CatalogFilter() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <>
        <div className="my-8 p-8 bg-[#F9F5EF] rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Поиск"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E88246] focus:border-[#E88246]"
              />
            </div>
            <button className="flex items-center justify-center w-14 h-12 border-2 border-[#E88246] rounded-lg text-[#E88246] font-bold text-lg hover:bg-[#E88246]/10 transition-colors">
              AI
            </button>
          </div>
          <div className="flex items-center gap-3">
            <FilterButton>Студия</FilterButton>
            <FilterButton>Однокомнатная</FilterButton>
            <FilterButton>Двухкомнатная</FilterButton>
            <FilterButton>Трехкомнатная</FilterButton>
            <FilterButton>Четырёхкомнатная+</FilterButton>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white border border-gray-300 rounded-lg p-3 text-gray-700 hover:bg-gray-100 transition-colors ml-auto">
              <svg
                className="w-8 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-1.586l-3.707-3.707A1 1 0 019 12V6.414L3.293 4.707A1 1 0 013 4z"></path>
              </svg>
            </button>
          </div>
        </div>
        <FilterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
}