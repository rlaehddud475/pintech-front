'use server'
import { cookies } from 'next/headers'

export default async function apiRequest(url, method = 'GET', body) {
  const apiUrl = /^http[s]?/.test(url) ? url : process.env.API_URL + url

  const cookie = await cookies()
  const token = cookie.get('token')

  let headers: Record<string, string> | null = null
  const options: RequestInit = { method }

  if (token?.value && token?.value?.trim()) {
    headers = {
      Authorization: `Bearer ${token}`,
    }
  }

  if (['POST', 'PATCH', 'PUT'].includes(method.toUpperCase()) && body) {
    if (!(body instanceof FormData)) {
      headers = headers ?? {}
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(body)
    }

    // body를 options에 추가
    options.body = body
  }

  if (headers) options.headers = headers

  return fetch(apiUrl, options)
}
