import type { Movie } from "../pages/User/Movies/MovieCard/MovieCard.tsx";
import type { MovieDetailInfo } from "../pages/User/MovieDetail/DetailHero/DetailHero.tsx";
import type { Review } from "../pages/User/MovieDetail/DetailReviews/DetailReviews.tsx";

// Mock Hot Movies on Home Page
export const HOT_MOVIES: Movie[] = [
    {
        id: 1,
        title: "Kẻ Đánh Cắp Giấc Mơ",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        genres: ["Action", "Sci-Fi"],
        status: "now_showing"
    },
    {
        id: 2,
        title: "Giai Điệu Tình Yêu",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        genres: ["Romance", "Music"],
        status: "now_showing"
    },
    {
        id: 3,
        title: "Bí Ẩn Căn Phòng",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80",
        rating: 4.3,
        genres: ["Mystery", "Thriller"],
        status: "now_showing"
    },
    {
        id: 4,
        title: "Nụ Cười Ngày Mới",
        image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
        rating: 4.2,
        genres: ["Comedy", "Family"],
        status: "now_showing"
    },
    {
        id: 5,
        title: "Chiến Binh Vũ Trụ",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        genres: ["Action", "Sci-Fi"],
        status: "now_showing"
    }
];

// Mock All Movies List (Movies Page)
export const INITIAL_MOVIES: Movie[] = [
    {
        id: 1,
        title: "Kẻ Đánh Cắp Giấc Mơ",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        genres: ["Action", "Sci-Fi"],
        status: "now_showing"
    },
    {
        id: 2,
        title: "Giai Điệu Tình Yêu",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        genres: ["Romance", "Music"],
        status: "now_showing"
    },
    {
        id: 3,
        title: "Bí Ẩn Căn Phòng",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80",
        rating: 4.3,
        genres: ["Mystery", "Thriller"],
        status: "now_showing"
    },
    {
        id: 4,
        title: "Nụ Cười Ngày Mới",
        image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
        rating: 4.2,
        genres: ["Comedy", "Family"],
        status: "now_showing"
    },
    {
        id: 5,
        title: "Chiến Binh Vũ Trụ",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        genres: ["Action", "Sci-Fi"],
        status: "now_showing"
    },
    {
        id: 6,
        title: "Thung Lũng Gió",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        genres: ["Adventure", "Animation"],
        status: "now_showing"
    },
    {
        id: 7,
        title: "Thám Tử Tư",
        image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80",
        rating: 4.4,
        genres: ["Mystery", "Crime"],
        status: "now_showing"
    },
    {
        id: 8,
        title: "Quái Vật Đáy Biển",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        rating: 4.1,
        genres: ["Horror", "Thriller"],
        status: "now_showing"
    },
    {
        id: 9,
        title: "Huyền Thoại Sân Cỏ",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        genres: ["Sports", "Drama"],
        status: "now_showing"
    },
    {
        id: 10,
        title: "Hành Tinh Xanh",
        image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        genres: ["Documentary", "Nature"],
        status: "now_showing"
    },
    // Coming soon movies
    {
        id: 11,
        title: "Chiến Binh Báo Đen",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        genres: ["Action", "Adventure"],
        status: "coming_soon",
        releaseDate: "15/06/2026"
    },
    {
        id: 12,
        title: "Vùng Đất Câm Lặng: Ngày Một",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        rating: 4.4,
        genres: ["Horror", "Thriller"],
        status: "coming_soon",
        releaseDate: "20/06/2026"
    },
    {
        id: 13,
        title: "Thế Giới Khủng Long: Sinh Tồn",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        genres: ["Action", "Sci-Fi"],
        status: "coming_soon",
        releaseDate: "28/06/2026"
    },
    {
        id: 14,
        title: "Phép Thuật Kỳ Lạ",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        genres: ["Animation", "Family"],
        status: "coming_soon",
        releaseDate: "05/07/2026"
    }
];

// Mock Details Database for Movie Details
export const MOVIES_DETAILS: Record<number, MovieDetailInfo> = {
    1: {
        id: 1,
        title: "Kẻ Đánh Cắp Giấc Mơ",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
        rating: 4.8,
        genres: ["Action", "Sci-Fi"],
        status: "now_showing",
        releaseDate: "15/05/2026",
        duration: "148 mins",
        ageRating: "R-16",
        language: "English - Vietnamese Subtitles",
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        description: "A professional thief who has the ability to enter the subconscious of others to steal secrets while they are dreaming. This time, he is given the reverse task: planting an idea into the target's mind to execute the perfect plan."
    },
    2: {
        id: 2,
        title: "Giai Điệu Tình Yêu",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
        rating: 4.5,
        genres: ["Romance", "Music"],
        status: "now_showing",
        releaseDate: "18/05/2026",
        duration: "128 mins",
        ageRating: "PG-13",
        language: "English - Vietnamese Subtitles",
        director: "Damien Chazelle",
        cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
        description: "A romantic and bittersweet love story between a passionate jazz musician and an aspiring young actress struggling to find her break in glamorous Hollywood."
    },
    3: {
        id: 3,
        title: "Bí Ẩn Căn Phòng",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
        rating: 4.3,
        genres: ["Mystery", "Thriller"],
        status: "now_showing",
        releaseDate: "20/05/2026",
        duration: "115 mins",
        ageRating: "R-18",
        language: "Korean - Vietnamese Subtitles",
        director: "Bong Joon-ho",
        cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
        description: "A mysterious murder occurs in a locked room at a wealthy family's villa. The police inspector must peel back every layer of deception from the residents to find the real killer."
    },
    4: {
        id: 4,
        title: "Nụ Cười Ngày Mới",
        image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
        rating: 4.2,
        genres: ["Comedy", "Family"],
        status: "now_showing",
        releaseDate: "22/05/2026",
        duration: "105 mins",
        ageRating: "G",
        language: "Vietnamese",
        director: "Tran Thanh",
        cast: ["Tuan Tran", "Uyen An", "Kha Nhu"],
        description: "A heartwarming family comedy-drama bringing gentle laughter and deep life lessons about parental love, filial piety, and daily generational conflicts."
    },
    5: {
        id: 5,
        title: "Chiến Binh Vũ Trụ",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        rating: 4.9,
        genres: ["Action", "Sci-Fi"],
        status: "now_showing",
        releaseDate: "10/05/2026",
        duration: "155 mins",
        ageRating: "PG-13",
        language: "English - Vietnamese Subtitles",
        director: "Denis Villeneuve",
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
        description: "The grand journey of a destined young hero tasked with protecting the universe's most valuable resource on a harsh desert planet."
    },
    6: {
        id: 6,
        title: "Thung Lũng Gió",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        rating: 4.7,
        genres: ["Adventure", "Animation"],
        status: "now_showing",
        releaseDate: "12/05/2026",
        duration: "116 mins",
        ageRating: "G",
        language: "Vietnamese Dubbed",
        director: "Hayao Miyazaki",
        cast: ["Sumi Shimamoto", "Mahito Tsujimura"],
        description: "In a distant future, a young princess fights to prevent two warring kingdoms from destroying each other and the fragile ecological environment of their valley."
    },
    7: {
        id: 7,
        title: "Thám Tử Tư",
        image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1200&q=80",
        rating: 4.4,
        genres: ["Mystery", "Crime"],
        status: "now_showing",
        releaseDate: "25/05/2026",
        duration: "120 mins",
        ageRating: "R-16",
        language: "English - Vietnamese Subtitles",
        director: "Rian Johnson",
        cast: ["Daniel Craig", "Chris Evans", "Ana de Armas"],
        description: "When a famous detective novelist dies mysteriously at his estate, an eccentric private investigator is hired to investigate and discovers everyone in the family has a motive."
    },
    8: {
        id: 8,
        title: "Quái Vật Đáy Biển",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        rating: 4.1,
        genres: ["Horror", "Thriller"],
        status: "now_showing",
        releaseDate: "27/05/2026",
        duration: "95 mins",
        ageRating: "R-18",
        language: "English - Vietnamese Subtitles",
        director: "William Eubank",
        cast: ["Kristen Stewart", "Vincent Cassel", "Mamoudou Athie"],
        description: "A crew of oceanic researchers working at a deep-sea drilling station face mysterious bloodthirsty creatures after an earthquake destroys their facility."
    },
    9: {
        id: 9,
        title: "Huyền Thoại Sân Cỏ",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
        rating: 4.6,
        genres: ["Sports", "Drama"],
        status: "now_showing",
        releaseDate: "14/05/2026",
        duration: "135 mins",
        ageRating: "PG-13",
        language: "English - Vietnamese Subtitles",
        director: "Ryan Coogler",
        cast: ["Michael B. Jordan", "Sylvester Stallone"],
        description: "An inspiring film about the arduous journey and extraordinary determination of a young athlete overcoming injury and social prejudice to prove himself on the professional field."
    },
    10: {
        id: 10,
        title: "Hành Tinh Xanh",
        image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80",
        rating: 4.8,
        genres: ["Documentary", "Nature"],
        status: "now_showing",
        releaseDate: "05/05/2026",
        duration: "90 mins",
        ageRating: "G",
        language: "English - Vietnamese Voiceover",
        director: "Alastair Fothergill",
        cast: ["David Attenborough"],
        description: "An amazing and vivid look at the incredibly rich biodiversity and survival challenges faced by wild flora and fauna on Earth."
    },
    11: {
        id: 11,
        title: "Chiến Binh Báo Đen",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
        rating: 4.7,
        genres: ["Action", "Adventure"],
        status: "coming_soon",
        releaseDate: "15/06/2026",
        duration: "134 mins",
        ageRating: "PG-13",
        language: "English - Vietnamese Subtitles",
        director: "Ryan Coogler",
        cast: ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o"],
        description: "Following his father's death, Prince T'Challa returns to the advanced nation of Wakanda to succeed to the throne and protect his country from hostile threats."
    },
    12: {
        id: 12,
        title: "Vùng Đất Câm Lặng: Ngày Một",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
        rating: 4.4,
        genres: ["Horror", "Thriller"],
        status: "coming_soon",
        releaseDate: "20/06/2026",
        duration: "100 mins",
        ageRating: "R-16",
        language: "English - Vietnamese Subtitles",
        director: "Michael Sarnoski",
        cast: ["Lupita Nyong'o", "Joseph Quinn"],
        description: "Experience the day the world went quiet in New York City, one of the loudest cities in the world, as sound-sensitive alien creatures first land."
    },
    13: {
        id: 13,
        title: "Thế Giới Khủng Long: Sinh Tồn",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
        rating: 4.6,
        genres: ["Action", "Sci-Fi"],
        status: "coming_soon",
        releaseDate: "28/06/2026",
        duration: "125 mins",
        ageRating: "PG-13",
        language: "English - Vietnamese Subtitles",
        director: "Colin Trevorrow",
        cast: ["Chris Pratt", "Bryce Dallas Howard"],
        description: "A struggle for survival as humanity lives alongside history's most fearsome creatures in a newly shared world."
    },
    14: {
        id: 14,
        title: "Phép Thuật Kỳ Lạ",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        backdrop: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
        rating: 4.5,
        genres: ["Animation", "Family"],
        status: "coming_soon",
        releaseDate: "05/07/2026",
        duration: "98 mins",
        ageRating: "G",
        language: "Vietnamese Dubbed",
        director: "Gary Rydstrom",
        cast: ["Alan Cumming", "Evan Rachel Wood"],
        description: "A musical animated fantasy adventure, inspired by A Midsummer Night's Dream, exploring a colorful and magical fairy tale world."
    }
};

// Mock Initial Reviews List
export const INITIAL_REVIEWS: Review[] = [
    {
        id: 1,
        name: "Minh Tuan Nguyen",
        rating: 5,
        comment: "This movie was absolutely amazing, with a highly creative and thrilling plot from beginning to end. Definitely worth the ticket price!",
        date: "29/05/2026"
    },
    {
        id: 2,
        name: "Hoai Thi Le",
        rating: 4,
        comment: "Outstanding visual effects and excellent acting by the main cast. However, the background music in some scenes was a bit too loud.",
        date: "28/05/2026"
    },
    {
        id: 3,
        name: "Nam Van Phan",
        rating: 5,
        comment: "I really loved the message of this film. Mievoh's cinema room has outstanding sound quality that makes the viewing experience perfect.",
        date: "27/05/2026"
    }
];
