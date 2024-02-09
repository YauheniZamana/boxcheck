import axios, {AxiosPromise, AxiosRequestConfig, Method} from 'axios';
import {BoxcheckApiOptions} from "./types";

export async function boxcheckApi<R = any>(
  method: Method = 'post',
  callOptions: BoxcheckApiOptions

): AxiosPromise<R> {
  const options: AxiosRequestConfig = {
    method,
    url: callOptions.targetUrl,
    baseURL: callOptions.baseUrl,
    data: callOptions.data,
  }

  if (callOptions.token) {
    options.params = {token: callOptions.token}
  }

  console.log("OPTIONS",options)

  return axios<R>(options)
}
