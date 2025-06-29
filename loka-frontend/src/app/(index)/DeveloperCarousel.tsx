"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Developer, DeveloperCard } from "./DeveloperCard";

interface DeveloperCarouselProps {
  developers: Developer[];
}

export function DeveloperCarousel({ developers }: DeveloperCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi]);

  return (
    <div className="relative mb-28">
      <div
        className="embla"
        ref={emblaRef}>
        <div className="embla__container">
          {developers.map((developer) => (
            <div
              className="embla__slide"
              key={developer.id}>
              <DeveloperCard {...developer} />
            </div>
          ))}
        </div>
      </div>
      <button
        className="hover:bg-[#f6efe5] absolute top-1/2 -translate-y-1/2 -left-5 z-50 bg-white p-2 rounded-full shadow-md disabled:opacity-30 cursor-pointer"
        onClick={scrollPrev}
        disabled={prevBtnDisabled}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        className="hover:bg-[#f6efe5] absolute top-1/2 -translate-y-1/2 -right-5 z-50 bg-white p-2 rounded-full shadow-md disabled:opacity-30 cursor-pointer"
        onClick={scrollNext}
        disabled={nextBtnDisabled}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
