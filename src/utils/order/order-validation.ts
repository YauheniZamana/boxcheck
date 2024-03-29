import {Order} from "../../../types/order";
import {validateObjectFieldsOnValue} from "../shared";

export interface OrderFieldsValidationResult {
  orderId: number,
  message: string
}

const validateOrderForShopify = (order: Order): string | null => {
  const validationResult: string[] = []

  if (order.Product.length) {
    order.Product.forEach(product => {
     const productValidation = validateObjectFieldsOnValue(product)
      if (productValidation.length) {
        validationResult.push(`Following fields are required for ${product.name} product: ${productValidation.join(', ')}.`)
      }
    })
  } else {
    validationResult.push('Products are required')
  }

  const addressValidation = validateObjectFieldsOnValue(order.ShippingAddress)

  if (addressValidation.length) {
    validationResult.push(`Following fields are required for shipping info: ${addressValidation.join(', ')}.`)
  }

  return validationResult.length
    ? validationResult.join(' ')
    : null
}

export const getOrdersValidationForShopify = (orders: Order[]): OrderFieldsValidationResult[] => {
  const validationResult: OrderFieldsValidationResult[] = []

  orders.forEach(order => {
    const orderValidationResult = validateOrderForShopify(order)

    if (orderValidationResult) {
      validationResult.push({orderId: order.id, message: orderValidationResult})
    }
  })

  return validationResult
}


