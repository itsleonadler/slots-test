"use client"
import axios, { AxiosError, AxiosInstance } from "axios"

export type ApiErrorPayload = {
  message?: string
  code?: string
  details?: unknown
}

export class ApiError extends Error {
  code?: string
  details?: unknown
  constructor(message: string, code?: string, details?: unknown) {
    super(message)
    this.code = code
    this.details = details
  }
}

export default class BaseApiService {
  protected api: AxiosInstance

  constructor(baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api") {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    this.api.interceptors.response.use(
      (res) => res,
      (err: AxiosError<ApiErrorPayload>) => {
        const msg =
          err.response?.data?.message || err.message || "Unexpected API error"
        const code = err.response?.data?.code
        const details = err.response?.data?.details
        return Promise.reject(new ApiError(msg, code, details))
      }
    )
  }
}
