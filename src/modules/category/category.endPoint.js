import { systemRoles } from "../../utils/systemRoles.js";



export const endPoints = {
    CREAT_CATEGORY: [systemRoles.ADMIN],
    UPDATE_CATEGORY: [systemRoles.ADMIN],
    DELETE_CATEGORY: [systemRoles.ADMIN]
}