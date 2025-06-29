"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive ? "text-[#E88246] font-semibold" : "text-[var(--foreground)] hover:text-gray-800"
      }`}>
      {children}
    </Link>
  );
};

export function Header() {
    return (
      <header className="sticky top-0 z-50 bg-[var(--background)]/50 backdrop-blur-md">
        <div className=" container mx-auto flex items-center justify-between py-4 px-6 relative backdrop:blur-3xl">
          {/* Лого */}
          <Link href="/" className="text-2xl font-semibold">LOKA</Link>

          {/* Навигация */}
          <nav className=" top-4 z-20 bg-white rounded-full px-20 py-2 flex justify-between space-x-8 w-xl">
            <NavLink href="/catalog">каталог</NavLink>
            <NavLink href="/map">карта</NavLink>
            <NavLink href="/mortgage">ипотека</NavLink>
          </nav>

          {/* Кнопки */}
          <div className="flex space-x-4">
            <button className="bg-[#E88246] hover:bg-[#ffa570] text-white px-4 py-2 rounded-full text-sm font-semibold">
              Войти
            </button>
            <button className="border-2 border-[#E88246] hover:border-[#ffa570] hover:text-[#ffa570] text-[#E88246] px-4 py-2 rounded-full text-sm font-semibold">
              Регистрация
            </button>
          </div>
        </div>
      </header>
    );
}