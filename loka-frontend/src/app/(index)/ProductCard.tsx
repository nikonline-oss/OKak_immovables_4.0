import Image from "next/image";

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  imageUrls: string[];
  rating: number;
  booking_status?: string;
}

export function ProductCard({
  title,
  subtitle,
  price,
  imageUrls,
  rating,
  booking_status
}: Product) {
  // Extract direct image URL from Yandex search URL if needed
  const getImageUrl = (url: string) => {
    try {
      if (url.includes('yandex.ru/images/search')) {
        const imgUrlParam = new URL(url).searchParams.get('img_url');
        return imgUrlParam ? decodeURIComponent(imgUrlParam) : url;
      }
      return url;
    } catch {
      return url;
    }
  };

  const mainImageUrl = imageUrls.length > 0 ? getImageUrl(imageUrls[0]) : null;

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden bg-[#fffcf7] p-4 transition-shadow hover:shadow-lg duration-300 ease-in-out">
      {booking_status && (
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium ${
          booking_status === 'available' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {booking_status === 'available' ? 'Доступно' : 'Забронировано'}
        </div>
      )}

      <div className="rounded-xl overflow-hidden mb-4">
        {mainImageUrl ? (
          <Image
            width={336}
            height={247}
            src={mainImageUrl}
            alt={title}
            className="object-cover w-full aspect-[336/247]"
            unoptimized={process.env.NODE_ENV !== 'production'} // Disable optimization in dev
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
        ) : (
          <div className="w-full aspect-[336/247] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Нет изображения</span>
          </div>
        )}
      </div>

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

      <div className="text-sm text-secondary mb-3">{subtitle}</div>

      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold text-[#E88246]">
          {price.toLocaleString("ru-RU")}
          <span className="text-[#666] ml-2">₽</span>
        </div>
      </div>
    </div>
  );
}