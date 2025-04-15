import { systemRoles } from "../../utils/systemRoles.js";



export const endPoints = {
    ADD_CART: [systemRoles.USER, systemRoles.ADMIN],
    GET_CART: [systemRoles.USER, systemRoles.ADMIN],
    REMOVE_CART: [systemRoles.USER, systemRoles.ADMIN],
    CLEAR_CART: [systemRoles.USER, systemRoles.ADMIN]
}