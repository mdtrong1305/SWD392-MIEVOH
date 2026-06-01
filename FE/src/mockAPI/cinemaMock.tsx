export interface CinemaBranch {
    id: number;
    name: string;
    address: string;
    phone: string;
    city: string;
    rating: number;
    priceRange: string;
    image: string;
}

export interface TheaterChain {
    id: string;
    name: string;
    logo: string;
    description: string;
    website: string;
    branches: CinemaBranch[];
}

export const THEATER_CHAINS: TheaterChain[] = [
    {
        id: "cgv",
        name: "CGV Cinemas",
        logo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=120&q=80",
        description: "The largest cinema chain in Vietnam with premium projection quality, modern technologies IMAX, 4DX, ScreenX.",
        website: "www.cgv.vn",
        branches: [
            {
                id: 101,
                name: "CGV Vincom Center Dong Khoi",
                address: "Floor 3, Vincom Center Dong Khoi, 72 Le Thanh Ton, Ben Nghe, District 1, HCMC",
                phone: "1900 6017",
                city: "Ho Chi Minh City",
                rating: 4.8,
                priceRange: "80,000 VND - 160,000 VND",
                image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 102,
                name: "CGV Crescent Mall",
                address: "Floor 5, Crescent Mall, 101 Ton Dat Tien, Tan Phu, District 7, HCMC",
                phone: "1900 6017",
                city: "Ho Chi Minh City",
                rating: 4.7,
                priceRange: "80,000 VND - 150,000 VND",
                image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 103,
                name: "CGV Vincom Center Ba Trieu",
                address: "Floor 6, Vincom Center, 191 Ba Trieu, Le Dai Hang, Hai Ba Trung, Hanoi",
                phone: "1900 6017",
                city: "Hanoi",
                rating: 4.8,
                priceRange: "85,000 VND - 160,000 VND",
                image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 104,
                name: "CGV Aeon Mall Long Bien",
                address: "Floor 4, Aeon Mall Long Bien, 27 Co Linh, Long Bien, Hanoi",
                phone: "1900 6017",
                city: "Hanoi",
                rating: 4.6,
                priceRange: "75,000 VND - 140,000 VND",
                image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 105,
                name: "CGV Vinh Trung Plaza",
                address: "Floor 3, Vinh Trung Plaza, 255-257 Hung Vuong, Thanh Khe, Da Nang",
                phone: "1900 6017",
                city: "Da Nang",
                rating: 4.5,
                priceRange: "70,000 VND - 130,000 VND",
                image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80"
            }
        ]
    },
    {
        id: "bhd",
        name: "BHD Star Cineplex",
        logo: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=120&q=80",
        description: "Dynamic cinema chain, youthful and friendly service with many attractive promotion programs.",
        website: "www.bhdstar.vn",
        branches: [
            {
                id: 201,
                name: "BHD Star Thao Dien",
                address: "Floor 5, Vincom Mega Mall Thao Dien, 159 Xa lo Ha Noi, District 2, HCMC",
                phone: "1900 2099",
                city: "Ho Chi Minh City",
                rating: 4.5,
                priceRange: "60,000 VND - 110,000 VND",
                image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 202,
                name: "BHD Star Bitexco",
                address: "Floor 3 & 4, Bitexco Financial Tower, 2 Hai Trieu, District 1, HCMC",
                phone: "1900 2099",
                city: "Ho Chi Minh City",
                rating: 4.6,
                priceRange: "65,000 VND - 120,000 VND",
                image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 203,
                name: "BHD Star Pham Ngoc Thach",
                address: "Floor 8, Vincom Center Pham Ngoc Thach, 2 Pham Ngoc Thach, Dong Da, Hanoi",
                phone: "1900 2099",
                city: "Hanoi",
                rating: 4.5,
                priceRange: "65,000 VND - 115,000 VND",
                image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80"
            }
        ]
    },
    {
        id: "lotte",
        name: "Lotte Cinema",
        logo: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=120&q=80",
        description: "Cinema chain from South Korea, offering luxurious entertainment space and top-notch Dolby Atmos surround sound technology.",
        website: "lottecinemavn.com",
        branches: [
            {
                id: 301,
                name: "Lotte Cinema Nam Sai Gon",
                address: "Floor 3, Lotte Mart Nam Sai Gon, 469 Nguyen Huu Tho, District 7, HCMC",
                phone: "028 3775 2524",
                city: "Ho Chi Minh City",
                rating: 4.7,
                priceRange: "70,000 VND - 130,000 VND",
                image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 302,
                name: "Lotte Cinema Go Vap",
                address: "Floor 3, Lotte Mart Go Vap, 242 Nguyen Van Luong, Go Vap, HCMC",
                phone: "028 3620 2011",
                city: "Ho Chi Minh City",
                rating: 4.4,
                priceRange: "60,000 VND - 110,000 VND",
                image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 303,
                name: "Lotte Cinema Kosmo",
                address: "Floor 2, Kosmo Tay Ho, 161 Xuan La, Bac Tu Liem, Hanoi",
                phone: "024 3206 8282",
                city: "Hanoi",
                rating: 4.5,
                priceRange: "65,000 VND - 120,000 VND",
                image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80"
            }
        ]
    },
    {
        id: "cinestar",
        name: "Cinestar",
        logo: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=120&q=80",
        description: "Affordable cinema chain, favorite destination for students with famous delicious popcorn and friendly service.",
        website: "cinestar.com.vn",
        branches: [
            {
                id: 401,
                name: "Cinestar Quoc Thanh",
                address: "271 Nguyen Trai, Nguyen Cu Trinh Ward, District 1, HCMC",
                phone: "028 7300 8881",
                city: "Ho Chi Minh City",
                rating: 4.3,
                priceRange: "45,000 VND - 90,000 VND",
                image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 402,
                name: "Cinestar Hai Ba Trung",
                address: "135 Hai Ba Trung, Ben Nghe Ward, District 1, HCMC",
                phone: "028 7300 8882",
                city: "Ho Chi Minh City",
                rating: 4.4,
                priceRange: "45,000 VND - 90,000 VND",
                image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 403,
                name: "Cinestar Students",
                address: "Green Square, Dong Hoa Ward, Di An, Binh Duong",
                phone: "0274 730 8881",
                city: "Binh Duong",
                rating: 4.5,
                priceRange: "45,000 VND - 85,000 VND",
                image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
            }
        ]
    },
    {
        id: "beta",
        name: "Beta Cinemas",
        logo: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=120&q=80",
        description: "Modern cinema chain with a colorful, youthful style, optimizing the movie experience with extremely reasonable costs.",
        website: "www.betacinemas.vn",
        branches: [
            {
                id: 501,
                name: "Beta Cinemas Quang Trung",
                address: "Floor 5, Co.opmart Quang Trung, 647 Quang Trung, Ward 11, Go Vap, HCMC",
                phone: "028 7302 8885",
                city: "Ho Chi Minh City",
                rating: 4.2,
                priceRange: "50,000 VND - 95,000 VND",
                image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 502,
                name: "Beta Cinemas Thanh Xuan",
                address: "Basement B1, Golden West Building, 2 Le Van Thiem, Nhan Chinh, Thanh Xuan, Hanoi",
                phone: "024 7302 8885",
                city: "Hanoi",
                rating: 4.3,
                priceRange: "50,000 VND - 100,000 VND",
                image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80"
            }
        ]
    }
];

export const CITIES = ["All", "Ho Chi Minh City", "Hanoi", "Da Nang", "Binh Duong"];
