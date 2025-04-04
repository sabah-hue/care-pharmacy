import { systemRoles } from "../../utils/systemRoles.js";

export const endPoints = {
    CREATE_BLOG: [systemRoles.ADMIN, systemRoles.USER],
    UPDATE_BLOG: [systemRoles.ADMIN, systemRoles.USER],
    DELETE_BLOG: [systemRoles.ADMIN, systemRoles.USER]
}
