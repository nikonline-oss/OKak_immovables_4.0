import { ProductCarousel } from "./ProductCarousel";
import { Product } from "./ProductCard";
import { Hero } from "./Hero";
import { Developer } from "./DeveloperCard";
import { DeveloperCarousel } from "./DeveloperCarousel";

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

const developers: Developer[] = [
  {
    id: 1,
    name: "DOGMA",
    logoUrl: "/logos/Догма.png",
    description:
      "девелопер федерального уровня. По объему текущего строительства входит в ТОП-5 застройщиков России, занимает первое место в Краснодарском крае. С 2011 года компания построила более 1,2 млн м², сдала точно в срок больше 60 домов.",
  },
  {
    id: 2,
    name: "ССК",
    logoUrl: "/logos/ССК.svg",
    description:
      "Один из крупнейших застройщиков Юга России. Компания специализируется на строительстве жилых комплексов комфорт и бизнес-класса, а также коммерческой недвижимости.",
  },
  {
    id: 3,
    name: "АСК",
    logoUrl: "/logos/АСК.jpg",
    description:
      "Группа компаний «АСК» — один из лидеров строительной отрасли юга России. За 10 лет работы компания построила и ввела в эксплуатацию более 1 млн кв. м жилья.",
  },
  {
    id: 4,
    name: "ИНСИТИ",
    logoUrl: "/logos/Инсити.jpg",
    description:
      "Строительная компания «ИНСИТИ» — это надежный застройщик, который уже более 10 лет строит качественное и комфортное жилье в Краснодаре. ",
  },
  {
    id: 5,
    name: "ТОЧНО",
    logoUrl: "/logos/ТОЧНО	.jpg",
    description:
      "ГК ТОЧНО — лидирующая инвестиционно-строительная компания Юга России, которая входит в ТОП-10 крупнейших застройщиков РФ, включена в список системообразующих предприятий России. Основана в 2013 году.",
  },
];

export default function HomePage() {
	return (
		<main className="container mx-auto">
			<Hero />
			<h1 className="text-6xl font-light my-8">
				<span className="text-[#E88246]">Горячие</span> предложения
			</h1>
			<ProductCarousel products={products} />
			<h1 className="text-6xl font-light my-8">
				Наши <span className="text-[#E88246]">Застройщики</span>
			</h1>
			<DeveloperCarousel developers={developers} />
		</main>
	);
}
