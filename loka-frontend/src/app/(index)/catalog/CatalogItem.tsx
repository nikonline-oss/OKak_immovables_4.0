import Image from "next/image";
import { IItem } from "@/shared/data/items.data";

// Вспомогательная функция для форматирования цены
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
};

export function CatalogItem({ item }: { item: IItem }) {
    return (
        <div className="bg-[#FFFCF7] rounded-2xl p-4 flex flex-col gap-3 transition-shadow hover:shadow-lg cursor-pointer">
            {/* Контейнер с изображением */}
            <div className="bg-white rounded-xl flex items-center justify-center p-4 aspect-square">
                <Image
                    src={item.imageUrls[0]}
                    alt={item.title}
                    width={250}
                    height={250}
                    className="object-contain w-full h-full"
                />
            </div>

            {/* Контейнер с информацией */}
            <div>
                {item.complexName && (
                    <p className="text-xs text-gray-500 mb-1">{item.complexName}</p>
                )}
                <h3 className="font-semibold text-lg">{item.title}</h3>
            </div>

            {/* Цена и иконка "в избранное" */}
            <div className="flex justify-between items-center mt-auto pt-2">
                <p className="text-xl font-bold text-gray-800">
                    {formatPrice(item.price)} ₽
                </p>
                <button className="text-gray-400 hover:text-[#E88246]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}