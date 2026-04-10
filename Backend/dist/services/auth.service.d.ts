import { RegisterInput, LoginInput, BillingAddressInput } from "../utils/validators";
export declare const authService: {
    register(data: RegisterInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string;
            plan: string;
        };
        token: string;
    }>;
    login(data: LoginInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phoneNumber: string;
            plan: string;
        };
        token: string;
    }>;
    getUserById(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        plan: string;
        billingAddress: {
            streetAddress: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        } | null;
    }>;
    addBillingAddress(userId: string, data: BillingAddressInput): Promise<{
        streetAddress: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getBillingAddress(userId: string): Promise<{
        streetAddress: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map