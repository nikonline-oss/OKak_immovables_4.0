"use client";

import React, { useRef } from "react";
import Script from "next/script";
import { hcsData } from "@/shared/data/hcs.data";

// Вспомогательная функция для форматирования цены
const formatPrice = (price: number) => {
  return `от ${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
};

export function YMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const isMapInitialized = useRef(false); // Флаг для предотвращения двойной инициализации

  const initializeMap = (ymaps: any) => {
    if (!mapRef.current || isMapInitialized.current) return;

    isMapInitialized.current = true; // Устанавливаем флаг, что карта инициализирована

    const map = new ymaps.Map(mapRef.current, {
      center: [45.035, 38.976], // Центр Краснодара [lat, lng]
      zoom: 11,
      controls: ["zoomControl", "geolocationControl"],
    });

    // Создаем коллекцию для маркеров
    const placemarks = new ymaps.GeoObjectCollection();

    // Добавляем маркеры на карту
    hcsData.forEach((hcs) => {
      const placemark = new ymaps.Placemark(
        [hcs.coordinates.lat, hcs.coordinates.lng],
        {
          // Контент для всплывающего окна (балуна)
          balloonContentHeader: `<h3 class="font-bold text-base">${hcs.name}</h3>`,
          balloonContentBody:
            `<img src="${hcs.imageUrl}" alt="${hcs.name}" class="w-full h-32 object-cover rounded-lg my-2" />` +
            `<p class="text-sm text-gray-600">${hcs.address}</p>`,
          balloonContentFooter: `<p class="text-base font-semibold mt-2">${formatPrice(
            hcs.minPrice
          )}</p>`,
        },
        {
          // Временно используем стандартный пресет для проверки
          preset: "islands#blueCircleDotIcon",
        }
      );
      placemarks.add(placemark);
    });

    map.geoObjects.add(placemarks);
  };

  return (
    <>
      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`}
        strategy="afterInteractive"
        onLoad={() => {
          if (window.ymaps) {
            (window.ymaps as any).ready(initializeMap);
          }
        }}
      />
      <div
        ref={mapRef}
        className="w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg"
      />
    </>
  );
}
