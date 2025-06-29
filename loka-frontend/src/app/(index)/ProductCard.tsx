import Image from "next/image";

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  imageUrls: string[];
  rating: number;
}

export function ProductCard({
  title,
  subtitle,
  price,
  imageUrls,
  rating,
}: Product) {
  return (
    <div className="max-w-sm rounded-2xl overflow-hidden bg-[#fffcf7] p-4 transition-shadow hover:shadow-lg duration-300 ease-in-out">
      {/** Изображение */}
      <div className="rounded-xl overflow-hidden mb-4">
        <Image
          width={336}
          height={247}
          src={imageUrls[0]} // Показываем только первое изображение
          alt={title}
          className="object-cover w-full aspect-[336/247]"
        />
      </div>

      {/** Название и рейтинг */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl text-foreground font-semibold">{title}</h2>
        <div className="flex items-center text-foreground font-semibold text-lg">
          {rating}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1">
            <path
              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
              fill="#2EAE0A"
            />
          </svg>
        </div>
      </div>

      {/** Подзаголовок */}
      <div className="text-sm text-secondary mb-3">{subtitle}</div>

      {/** Цена и иконка */}
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold text-[#E88246]">
          {price.toLocaleString("ru-RU")}
          <span className="text-[#666] ml-2">₽</span>
        </div>
      </div>
    </div>
  );
}