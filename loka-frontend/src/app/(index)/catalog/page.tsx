import { Product } from "../ProductCard";
import { ProductCarousel } from "../ProductCarousel";
import { CatalogFilter } from "./CatalogFilter";
import { CatalogList } from "./CatalogList";

const products: Product[] = [
  {
    id: 1,
    title: "ЖК “Самолет”",
    subtitle: "инфо по квартире",
    price: 5560000,
    imageUrls: ["/image.png"],
    rating: 66,
  },
  {
    id: 2,
    title: "ЖК “Рекорд”",
    subtitle: "инфо по квартире",
    price: 4800000,
    imageUrls: ["/image copy.png"],
    rating: 72,
  },
  {
    id: 3,
    title: "ЖК “Парк Победы 2”",
    subtitle: "инфо по квартире",
    price: 6100000,
    imageUrls: ["/hero-image.png"],
    rating: 81,
  },
  {
    id: 4,
    title: "ЖК “Народные Кварталы”",
    subtitle: "инфо по квартире",
    price: 7250000,
    imageUrls: ["/image copy 2.png"],
    rating: 90,
  },
  {
    id: 5,
    title: "ЖК “Новый город”",
    subtitle: "инфо по квартире",
    price: 4950000,
    imageUrls: ["/image.png"],
    rating: 75,
  },
  {
    id: 6,
    title: "ЖК “Солнечный берег”",
    subtitle: "инфо по квартире",
    price: 5300000,
    imageUrls: ["/image.png"],
    rating: 88,
  },
];

export default function CatalogPage() {
  return (
    <main className="container mx-auto">
      <h1 className="text-6xl font-light my-8">
        <span className="text-[#E88246]">Горячие</span> предложения
      </h1>
      <ProductCarousel products={products} />
      <h1 className="text-6xl font-light my-8">
        <span className="text-[#E88246]">Каталог</span> товаров
      </h1>
			<CatalogFilter />
			<CatalogList />
    </main>
  );
}
