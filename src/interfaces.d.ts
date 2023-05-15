export interface Product {
    Id: number;
    Name: string;
    Description: string;
    Price: number;
    ImageUrl: string;
    Quantity: number;
    IsAvailable: boolean;
    CategoryId: number;
    CompanyId: number;
}
export type Props = {
    params: {
        id: string;
    }
};
export interface User {
    Id: number;
    FirstName: string;
    LastName: string;
    Gender: number;
    DateOfBirth: string;
    Email: string;
    Phone: string;
    ProfilePicture: string;
    Address: string;
    Password: string;
    Role: number;
}