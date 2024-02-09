import axios, { AxiosPromise, AxiosRequestConfig, Method } from 'axios'

import { ShopifyApiOptions } from './types'

export async function shopifyApi<R = any>(
  method: Method = 'get',
  callOptions: ShopifyApiOptions,
  responseType?: 'arraybuffer' | 'document' | 'json' | 'text' | 'stream',
): AxiosPromise<R> {
  const options: AxiosRequestConfig = {
    method,
    url: callOptions.targetURL,
    headers: {
      'X-Shopify-Access-Token': callOptions.accessToken,
    },
    baseURL: callOptions.baseURL,
    data: callOptions.data,
    responseType,
  }
  return axios<R>(options)
}
