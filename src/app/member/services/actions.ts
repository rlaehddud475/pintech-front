'use server'
import { redirect, RedirectType } from 'next/navigation'
import { format } from 'date-fns'
import { cookies } from 'next/headers'
import apiRequest from '@/app/global/libs/apiRequest'
import { revalidatePath } from 'next/cache'

/**
 * 회원가입 처리
 * @param params : 쿼리스트링값
 * @param formData
 */
export const processJoin = async (params, formData: FormData) => {
  const redirectUrl = params?.redirectUrl ?? '/member/login'
  const form: Record<string, string | Date | File> = {}
  let errors: Record<string, string[]> = {}
  let hasErrors = false

  // Iterate through the FormData entries
  for (const [key, value] of formData.entries()) {
    if (key.includes('$ACTION')) continue

    let tempValue: string | boolean | Date | File = value

    // Handle 'birthDt' field: convert date format
    if (
      key === 'birthDt' &&
      typeof tempValue === 'string' &&
      tempValue.trim()
    ) {
      tempValue = format(new Date(tempValue), 'yyyy-MM-dd')
    }

    // Convert string 'true'/'false' to boolean and vice versa
    if (typeof tempValue === 'string') {
      if (tempValue === 'false' || tempValue === 'true') {
        tempValue = tempValue === 'true' // 'true' as boolean
      }
    }

    // Convert boolean to string ('true'/'false')
    if (typeof tempValue === 'boolean') {
      tempValue = tempValue ? 'true' : 'false'
    }

    form[key] = tempValue
  }

  // Required fields validation
  const requiredFields: Record<string, string> = {
    email: '이메일을 입력하세요.',
    name: '이름을 입력하세요.',
    password: '비밀번호를 입력하세요.',
    confirmPassword: '비밀번호를 확인하세요.',
    phoneNumber: '휴대폰번호를 입력하세요.',
    gender: '성별을 선택하세요.',
    birthDt: '생년월일을 선택하세요.',
    requiredTerms1: '이용약관에 동의 하셔야 합니다.',
    requiredTerms2: '개인정보 처리방침에 동의 하셔야 합니다.',
    requiredTerms3: '개인정보 수집 및 이용에 동의 하셔야 합니다.',
  }

  for (const [field, msg] of Object.entries(requiredFields)) {
    if (
      !form[field] ||
      (typeof form[field] === 'string' && !form[field].trim())
    ) {
      errors[field] = errors[field] ?? []
      errors[field].push(msg)
      hasErrors = true
    }
  }

  // Address validation
  if (
    typeof form.zipCode === 'string' &&
    (!form.zipCode.trim() ||
      (typeof form.address === 'string' && !form.address.trim()))
  ) {
    errors.address = errors.address ?? []
    errors.address.push('주소를 입력하세요.')
    hasErrors = true
  }

  // Password match validation
  if (form?.password && form?.password !== form?.confirmPassword) {
    errors.confirmPassword = errors.confirmPassword ?? []
    errors.confirmPassword.push('비밀번호가 일치하지 않습니다.')
    hasErrors = true
  }

  // Server request handling
  if (!hasErrors) {
    const apiUrl = process.env.API_URL + '/member/join'
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (res.status !== 201) {
        const result = await res.json()
        errors = result.message || errors
        hasErrors = true
      }
    } catch (err) {
      console.error('API Request Error:', err)
      errors.api = ['서버 요청 중 오류가 발생했습니다.']
      hasErrors = true
    }
  }

  if (hasErrors) {
    return errors
  }

  // Redirect after successful registration
  redirect(redirectUrl)
}

/**
 * 로그인 처리
 * @param params
 * @param formData
 */
export const processLogin = async (params, formData: FormData) => {
  const redirectUrl = params?.redirectUrl ?? '/'
  let errors: Record<string, string[]> = {}
  let hasErrors = false

  // Required fields validation
  const email = formData.get('email')
  const password = formData.get('password')

  // Only trim string values to avoid issues with File type
  if (typeof email === 'string' && (!email || !email.trim())) {
    errors.email = errors.email ?? []
    errors.email.push('이메일을 입력하세요.')
    hasErrors = true
  }

  if (typeof password === 'string' && (!password || !password.trim())) {
    errors.password = errors.password ?? []
    errors.password.push('비밀번호를 입력하세요.')
    hasErrors = true
  }

  // Server request handling
  if (!hasErrors) {
    const apiUrl = process.env.API_URL + '/member/login'
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await res.json()
      if (res.status === 200 && result.success) {
        // Successful login, set cookie
        const cookie = await cookies()
        cookie.set('token', result.data, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          path: '/',
        })
      } else {
        // Login failed
        errors = result.message || errors
        hasErrors = true
      }
    } catch (err) {
      console.error('Login Request Error:', err)
      errors.api = ['서버 요청 중 오류가 발생했습니다.']
      hasErrors = true
    }
  }

  if (hasErrors) {
    return errors
  }

  // Cache revalidation and redirect after successful login
  revalidatePath('/', 'layout')
  redirect(redirectUrl, RedirectType.replace)
}

/**
 * 로그인한 회원 정보를 조회
 */
export const getUserInfo = async () => {
  const cookie = await cookies()
  if (!cookie.has('token')) return

  try {
    const res = await apiRequest('/member', 'GET', {
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
    })
    if (res.status === 200) {
      const result = await res.json()
      return result.success && result.data
    }
  } catch (err) {
    console.error('Error fetching user info:', err)
  }
}
