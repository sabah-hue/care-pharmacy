import { systemRoles } from "../../utils/systemRoles.js";

export const endPoints = {
     CREATE_DONATION: [systemRoles.ADMIN, systemRoles.USER],
    UPDATE_DONATION: [systemRoles.ADMIN],
    DELETE_DONATION: [systemRoles.ADMIN],
    GET_ALL_DONATIONS: [systemRoles.ADMIN, systemRoles.USER],
    GET_DONATION_BY_ID: [systemRoles.ADMIN, systemRoles.USER],
    PAYMENT_DONATION: [systemRoles.USER, systemRoles.ADMIN],
}