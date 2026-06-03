export interface ComboItem {
    id: number;
    name: string;
    name_vi?: string;
    name_en?: string;
    description: string;
    description_vi?: string;
    description_en?: string;
    price: number;
    image: string;
}

export const BOOKING_COMBOS: ComboItem[] = [
    {
        id: 1,
        name: "Combo Solo",
        name_vi: "Combo Đơn",
        name_en: "Combo Solo",
        description: "1 Mid Sweet Popcorn (60oz) + 1 Mid Soft Drink (22oz)",
        description_vi: "1 Bắp ngọt vừa (60oz) + 1 Nước ngọt vừa (22oz)",
        description_en: "1 Mid Sweet Popcorn (60oz) + 1 Mid Soft Drink (22oz)",
        price: 75000,
        image: "🍿🥤"
    },
    {
        id: 2,
        name: "Combo Buddy",
        name_vi: "Combo Đôi",
        name_en: "Combo Buddy",
        description: "1 Large Popcorn (85oz) + 2 Mid Soft Drinks (22oz)",
        description_vi: "1 Bắp lớn (85oz) + 2 Nước ngọt vừa (22oz)",
        description_en: "1 Large Popcorn (85oz) + 2 Mid Soft Drinks (22oz)",
        price: 115000,
        image: "🍿🥤🥤"
    },
    {
        id: 3,
        name: "Combo Family",
        name_vi: "Combo Gia Đình",
        name_en: "Combo Family",
        description: "2 Large Popcorns (85oz) + 3 Mid Soft Drinks (22oz) + 1 Snack",
        description_vi: "2 Bắp lớn (85oz) + 3 Nước ngọt vừa (22oz) + 1 Snack",
        description_en: "2 Large Popcorns (85oz) + 3 Mid Soft Drinks (22oz) + 1 Snack",
        price: 165000,
        image: "🍿🍿🥤🥤🥤🍟"
    }
];

export const BOOKED_SEATS_MOCK = new Set<string>([
    "A3", "A4",
    "B7", "B8",
    "C5", "C6",
    "D1", "D2", "D9", "D10",
    "E5", "E6",
    "F4", "F5",
    "G8", "G9",
    "H3",
    "J3"
]);
