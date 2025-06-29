export interface IHCS {
    id: number;
    name: string;
    developer: string;
    address: string;
    class: 'Комфорт' | 'Бизнес' | 'Эконом';
    deadline: string;
    minPrice: number;
    imageUrl: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

export const hcsData: IHCS[] = [
    {
        id: 1,
        name: "ЖК Самолёт",
        developer: "DOGMA",
        address: "ул. Западный Обход, 39",
        class: 'Комфорт',
        deadline: "Сдан",
        minPrice: 4500000,
        imageUrl: "/hcs/samolet.jpg",
        coordinates: { lat: 45.0533, lng: 38.9135 }
    },
    {
        id: 2,
        name: "ЖК Рекорд",
        developer: "ССК",
        address: "ул. им. Героя Яцкова И.В., 9к1",
        class: 'Комфорт',
        deadline: "4 кв. 2025 г.",
        minPrice: 4800000,
        imageUrl: "/hcs/rekord.jpg",
        coordinates: { lat: 45.0611, lng: 39.0287 }
    },
    {
        id: 3,
        name: "ЖК Парк Победы 2",
        developer: "АСК",
        address: "ул. Конгрессная, 25",
        class: 'Комфорт',
        deadline: "Сдан",
        minPrice: 5100000,
        imageUrl: "/hcs/park-pobedy.jpg",
        coordinates: { lat: 45.1085, lng: 38.9642 }
    },
    {
        id: 4,
        name: "ЖК Дыхание",
        developer: "ССК",
        address: "ул. Почтовое отделение 31, 54",
        class: 'Комфорт',
        deadline: "3 кв. 2026 г.",
        minPrice: 3900000,
        imageUrl: "/hcs/dyhanie.jpg",
        coordinates: { lat: 45.1250, lng: 39.0410 }
    },
    {
        id: 5,
        name: "ЖК Губернский",
        developer: "ЮгСтройИнвест",
        address: "ул. им. Героя Яцкова И.В., 15/1",
        class: 'Комфорт',
        deadline: "Сдан",
        minPrice: 5300000,
        imageUrl: "/hcs/gubernskiy.jpg",
        coordinates: { lat: 45.0645, lng: 39.0351 }
    },
    {
        id: 6,
        name: "ЖК Достояние",
        developer: "ЮгСтройИнвест",
        address: "ул. Конгрессная, 41",
        class: 'Комфорт',
        deadline: "1 кв. 2025 г.",
        minPrice: 4700000,
        imageUrl: "/hcs/dostoyanie.jpg",
        coordinates: { lat: 45.1120, lng: 38.9698 }
    },
    {
        id: 7,
        name: "ЖК Светлоград",
        developer: "Семья",
        address: "ул. Красных Партизан, 1/3",
        class: 'Эконом',
        deadline: "Сдан",
        minPrice: 3500000,
        imageUrl: "/hcs/svetlograd.jpg",
        coordinates: { lat: 45.0486, lng: 38.9011 }
    },
    {
        id: 8,
        name: "ЖК Balance",
        developer: "АСК",
        address: "ул. им. Кирилла Россинского, 23",
        class: 'Бизнес',
        deadline: "2 кв. 2025 г.",
        minPrice: 6200000,
        imageUrl: "/hcs/balance.jpg",
        coordinates: { lat: 45.0888, lng: 39.0485 }
    }
];