import Image from "next/image";

export function Hero() {
    return (
      <section className="my-16 mb-36">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-light leading-tight">
              Находите
              <br />
              <span className="text-[#E88246]">идеальную квартиру</span>
              <br />
              без посредников
            </h1>
          </div>
          <div className="pt-4">
            <p className="text-secondary mb-6 max-w-md">
              Прямое взаимодействие с застройщиками — выгодные цены, прозрачные
              условия и тысячи вариантов в одном месте.
            </p>
            <button className="bg-[#E88246] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#ffa570] transition-colors w-[372px] h-[70px] text-3xl">
              Выбрать квартиру
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 border-2 border-white/50 rounded-[48px] -m-4 pointer-events-none"></div>
          <Image
            src="/hero-image.png"
            alt="Жилой комплекс"
            width={1120}
            height={500}
            className="rounded-3xl object-cover w-full"
            priority
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[80%]">
            <div className="bg-[#FFFCF7D6]/84 backdrop-blur-sm p-6 rounded-2xl shadow-lg grid grid-cols-3 divide-x divide-gray-300">
              <div className="px-4 text-center">
                <div className="font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  Локация
                </div>
                <div className="text-secondary">Текст</div>
              </div>
              <div className="px-4 text-center">
                <div className="font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  Количество комнат
                </div>
                <div className="text-secondary">Текст</div>
              </div>
              <div className="px-4 text-center">
                <div className="font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  Бюджет
                </div>
                <div className="text-secondary">Текст</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}