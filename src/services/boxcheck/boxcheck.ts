import { errors } from '@strapi/utils'
import {boxcheckApi} from "./boxcheckApi";
import {BoxcheckApiAccessOptions, BoxcheckAuthData} from "./boxcheckApi/types";
import {BoxcheckApiOptions} from "./boxcheckApi/types";

const { ApplicationError } = errors

export async function getAuthToken(
  data: BoxcheckAuthData,
  options: BoxcheckApiAccessOptions
) {
  const res = await boxcheckApi('post', {
    data,
    targetUrl: 'generateToken',
    ...options
  }).catch((error) => {
    console.log("ERROR RESPONSE", error.response.data)
    throw new ApplicationError(error.message, 'Error while getAuthToken call')
  })

  return res?.data?.data
}
