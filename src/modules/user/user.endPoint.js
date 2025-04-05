import { systemRoles } from "../../utils/systemRoles.js";

export const endPoints = {
    LOGOUT: [systemRoles.ADMIN, systemRoles.USER],
    GET_ALL_USERS: [systemRoles.ADMIN],
    GET_USER: [systemRoles.ADMIN, systemRoles.USER],
    UPDATE_USER: [systemRoles.ADMIN, systemRoles.USER],
    DELETE_USER: [systemRoles.ADMIN],
    CHANGE_PASSWORD: [ systemRoles.USER, systemRoles.ADMIN],
    UPDATE_PROFILE: [systemRoles.ADMIN, systemRoles.USER],
    ADD_TO_WHISHLIST: [systemRoles.USER, systemRoles.ADMIN],
    REMOVE_FROM_WHISHLIST: [systemRoles.USER],
    GET_WHISHLIST: [systemRoles.USER, systemRoles.ADMIN],
    GET_MY_ORDERS: [systemRoles.USER, systemRoles.ADMIN],
}
