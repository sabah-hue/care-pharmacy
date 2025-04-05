import { systemRoles } from "../../utils/systemRoles.js";



export const endPoints = {
    CREAT_ORDER:[systemRoles.USER, systemRoles.ADMIN],
    CACNCEL_ORDER:[systemRoles.USER, systemRoles.ADMIN],
    GET_ORDERS:[systemRoles.USER, systemRoles.ADMIN],
    UPDATE_ORDER:[systemRoles.USER, systemRoles.ADMIN],
}