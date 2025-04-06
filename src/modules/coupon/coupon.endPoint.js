import { systemRoles } from "../../utils/systemRoles.js";



export const endPoints = {
    CREAT_COUPON: [systemRoles.ADMIN],
    UPDATE_COUPON: [systemRoles.ADMIN],
    DELETE_COUPON: [systemRoles.ADMIN],
    GET_ALL_COUPONS: [systemRoles.ADMIN],
    GET_QR_CODE: [systemRoles.ADMIN, systemRoles.USER],
}