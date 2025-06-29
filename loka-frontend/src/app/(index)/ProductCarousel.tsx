"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ProductCard } from "./ProductCard";

interface Apartment {
  id: string;
  title: string;
  description: string;
  price: string;
  address: string;
  region: string;
  booking_status: string;
  Developer: {
    name: string;
  };
  MediaBlocks: {
    url: string;
  }[];
}

export function ProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/apartments');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setApartments(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

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
  }, [emblaApi, apartments]);

  if (loading) {
    return <div className="text-center py-10">Loading apartments...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (apartments.length === 0) {
    return <div className="text-center py-10">No apartments available</div>;
  }

  return (
    <div className="relative mb-28">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {apartments.map((apartment) => {
            const product = {
              id: parseInt(apartment.id.replace(/\D/g, '').slice(0, 9)),
              title: apartment.title,
              subtitle: `${apartment.Developer.name}, ${apartment.address}`,
              price: parseFloat(apartment.price),
              imageUrls: apartment.MediaBlocks.map(block => block.url),
              rating: 4.5,
              booking_status: apartment.booking_status
            };
            
            return (
              <div className="embla__slide" key={apartment.id}>
                <ProductCard {...product} />
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="hover:bg-[#f6efe5] absolute top-1/2 -translate-y-1/2 -left-5 z-10 bg-white p-2 rounded-full shadow-md disabled:opacity-30 cursor-pointer"
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
        className="hover:bg-[#f6efe5] absolute top-1/2 -translate-y-1/2 -right-5 z-10 bg-white p-2 rounded-full shadow-md disabled:opacity-30 cursor-pointer"
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