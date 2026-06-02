export interface UserMock {
    id: string;
    email: string;
    matKhau: string;
    password?: string;
    hoTen: string;
    name?: string;
    soDT: string;
    phone?: string;
    role: string;
    avatar?: string;
}

export const MOCK_USERS: UserMock[] = [
    {
        id: "mock-user-1",
        email: "tqlam150504@gmail.com",
        matKhau: "12345",
        password: "12345",
        hoTen: "Sú Đũy",
        name: "Sú Đũy",
        soDT: "0854340045",
        phone: "0854340045",
        role: "USER",
        avatar: "/images/avatar.jpg"
    },
    {
        id: "mock-user-admin",
        email: "admin@gmail.com",
        matKhau: "12345",
        password: "12345",
        hoTen: "System Admin",
        name: "System Admin",
        soDT: "0999999999",
        phone: "0999999999",
        role: "ADMIN",
        avatar: "/images/avatar.jpg"
    }
];
