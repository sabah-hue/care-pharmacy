import { systemRoles } from "../../utils/systemRoles.js";

export const endPoints = {
    LOGOUT: [systemRoles.ADMIN, systemRoles.USER],
    GET_ALL_USERS: [systemRoles.ADMIN],
    GET_USER: [systemRoles.ADMIN, systemRoles.USER],
    UPDATE_USER: [systemRoles.ADMIN, systemRoles.USER],
    DELETE_USER: [systemRoles.ADMIN],
    CHANGE_PASSWORD: [ systemRoles.USER, systemRoles.ADMIN],
    UPDATE_PROFILE: [systemRoles.ADMIN, systemRoles.USER]
}
