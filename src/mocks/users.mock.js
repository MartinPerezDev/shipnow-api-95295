import { USER_ROLES } from "../utils/constants.js";


export const generateMockUser = (
    index,
    role = USER_ROLES.CUSTOMER
) => {

    return {
        firstName: `Usuario${index}`,
        lastName: `Demo${index}`,
        email: `user${index}@test.com`,
        password: "coder123",
        role
    };
};


export const generateMockUsers = (quantity) => {

    return Array.from(
        { length: quantity },
        (_, index) =>
            generateMockUser(index + 1)
    );
};


export const generateMockDrivers = (quantity) => {

    return Array.from(
        { length: quantity },
        (_, index) => ({
            firstName: `Driver${index + 1}`,
            lastName: `Demo${index + 1}`,
            email: `driver${index + 1}@test.com`,
            password: "coder123",
            role: USER_ROLES.DRIVER,
            isAvailable: true
        })
    );
};