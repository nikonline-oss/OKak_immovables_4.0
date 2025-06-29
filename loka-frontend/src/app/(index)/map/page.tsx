import { YMap } from "./YMap";
import { AddressFilter } from "./AddressFilter";

export default function MapPage() {
  return (
    <main className="container mx-auto my-8">
      <h1 className="text-6xl font-light mb-8 mt-24">
        <span className="text-[#E88246]">Объекты</span> на карте
      </h1>
      <YMap />
      <h1 className="text-6xl font-light mt-24">
        <span className="text-[#E88246]">Адреса</span> ЖК
      </h1>
      <AddressFilter />
    </main>
  );
}