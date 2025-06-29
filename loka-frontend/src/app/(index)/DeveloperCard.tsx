import Image from "next/image";

export interface Developer {
    id: number;
    name: string;
    logoUrl: string;
    description: string;
}

export function DeveloperCard({ name, logoUrl, description }: Developer) {
    return (
      <div className="bg-[#fffcf7] p-6 rounded-2xl border border-gray-200 h-full flex flex-col transition-shadow hover:shadow-lg">
        <div className="bg-white rounded-xl p-8 mb-6 flex items-center justify-center flex-grow">
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            width={200}
            height={80}
            className="object-contain"
          />
        </div>
        <h3 className="text-2xl font-bold mb-4">{name}</h3>
        <p className="text-sm text-secondary">{description}</p>
      </div>
    );
}