export interface IItem {
    id: number;
    title: string; 
    complexName?: string; 
    address: string; 
    price: number;
    imageUrls: string[];
    rating?: number; 
    
    // Details for filtering
    type: 'new' | 'secondary';
    area: number; 
    rooms: 'studio' | 1 | 2 | 3 | 4; 
    
    // Secondary market specific
    renovation?: 'none' | 'cosmetic' | 'euro' | 'design'; 
    
    // New build specific
    developerName?: string; 
    deadline?: string; 
}

export const itemsData: IItem[] = [
    {
        id: 1,
        title: "1-комнатная квартира, 42 м²",
        complexName: "ЖК “Самолет”",
        address: "г. Краснодар, ул. Западный Обход, 39",
        price: 5560000,
        imageUrls: ["/items/item-1.png"],
        rating: 8.5,
        type: 'new',
        area: 42,
        rooms: 1,
        developerName: "DOGMA",
        deadline: "Сдан"
    },
    {
        id: 2,
        title: "2-комнатная квартира, 65 м²",
        complexName: "ЖК “Рекорд”",
        address: "г. Краснодар, ул. им. Героя Яцкова И.В., 9к1",
        price: 7800000,
        imageUrls: ["/items/item-2.png"],
        rating: 8.9,
        type: 'new',
        area: 65,
        rooms: 2,
        developerName: "ССК",
        deadline: "4 кв. 2025 г."
    },
    {
        id: 3,
        title: "Квартира-студия, 28 м²",
        address: "г. Краснодар, ул. Красная, 176",
        price: 4100000,
        imageUrls: ["/items/item-3.png"],
        type: 'secondary',
        area: 28,
        rooms: 'studio',
        renovation: 'cosmetic'
    },
    {
        id: 4,
        title: "3-комнатная квартира, 88 м²",
        complexName: "ЖК “Парк Победы 2”",
        address: "г. Краснодар, ул. Конгрессная, 25",
        price: 9250000,
        imageUrls: ["/items/item-1.png"],
        rating: 9.1,
        type: 'new',
        area: 88,
        rooms: 3,
        developerName: "АСК",
        deadline: "Сдан"
    },
    {
        id: 5,
        title: "2-комнатная квартира, 58 м²",
        address: "г. Краснодар, ул. Ставропольская, 107/9",
        price: 6300000,
        imageUrls: ["/items/item-2.png"],
        type: 'secondary',
        area: 58,
        rooms: 2,
        renovation: 'euro'
    },
    {
        id: 6,
        title: "1-комнатная квартира, 39 м²",
        complexName: "ЖК “Новый город”",
        address: "г. Краснодар, ул. Дзержинского, 100",
        price: 4950000,
        imageUrls: ["/items/item-3.png"],
        rating: 8.2,
        type: 'new',
        area: 39,
        rooms: 1,
        developerName: "ИНСИТИ",
        deadline: "2 кв. 2026 г."
    },
    {
        id: 7,
        title: "4-комнатная квартира, 120 м²",
        address: "г. Краснодар, ул. Кубанская Набережная, 39",
        price: 15500000,
        imageUrls: ["/items/item-1.png"],
        type: 'secondary',
        area: 120,
        rooms: 4,
        renovation: 'design'
    },
    {
        id: 8,
        title: "Квартира-студия, 31 м²",
        complexName: "ЖК “Солнечный берег”",
        address: "г. Краснодар, ул. им. 40-летия Победы, 186",
        price: 3800000,
        imageUrls: ["/items/item-2.png"],
        rating: 8.6,
        type: 'new',
        area: 31,
        rooms: 'studio',
        developerName: "ТОЧНО",
        deadline: "Сдан"
    }
];