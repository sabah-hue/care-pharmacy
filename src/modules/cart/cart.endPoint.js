import { systemRoles } from "../../utils/systemRoles.js";



export const endPoints = {
    ADD_CART: [systemRoles.USER],
    GET_CART: [systemRoles.USER],
    REMOVE_CART: [systemRoles.USER],
    CLEAR_CART: [systemRoles.USER]
}