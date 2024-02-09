export interface BoxcheckApiAccessOptions {
  baseUrl: string,
  token?: string,
}

export interface BoxcheckApiOptions extends BoxcheckApiAccessOptions {
  targetUrl: string,
  data?: object
}

export interface BoxcheckAuthData {
  userName: string,
  password: string
}
