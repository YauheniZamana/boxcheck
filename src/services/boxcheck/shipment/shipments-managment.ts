import { errors } from '@strapi/utils'
import {getAuthToken} from "../boxcheck";
import {BoxcheckApiAccessOptions} from "../boxcheckApi/types";
import {Strapi} from "@strapi/types";
import {findOrdersFromListById} from "../../../db/db-order";
import {getOrdersValidationForShopify} from "../../../utils/order/order-validation";

const { ValidationError } = errors
const BOXCHECK_API_URL = process.env.BOXCHECK_API_URL
const BOXCHECK_USER = process.env.BOXCHECK_USER
const BOXCHECK_PASSWORD = process.env.BOXCHECK_PASSWORD
export async function manageShipments(strapi: Strapi, ordersIds: number[]) {
  const orders = await findOrdersFromListById(strapi, ordersIds)

  if (!orders.length) {
    throw new ValidationError(`No orders for shipment`)
  }

  const orderValidation = getOrdersValidationForShopify(orders)

  console.log("VALIDATION", orderValidation)

  const apiAccessOptions: BoxcheckApiAccessOptions = {
    baseUrl: BOXCHECK_API_URL
  }

  const boxcheckToken = await getAuthToken(
    {
      userName: BOXCHECK_USER,
      password: BOXCHECK_PASSWORD
    },
    apiAccessOptions
  )

  if (!boxcheckToken.length) {
    throw new ValidationError(`Boxcheck token is required`)
  }



}
