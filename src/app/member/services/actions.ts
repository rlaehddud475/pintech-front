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

  const form = {}
  let errors = {}
  let hasErrors = false

  for (const v of formData.entries()) {
    const key = v.key
    let value = v.value
    if (key.includes('$ACTION')) continue

    if (key === 'birthDt' && value && value.trim()) {
      value = format(new Date(value), 'yyyy-MM-dd')
    }

    if (['false', 'true'].includes(value)) {
      value = value === 'true'
    }

    form[key] = value
  }

  // 필수 항목 검증 S
  const requiredFields = {
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

  // 주소 항목 검증
  if (
    !form.zipCode ||
    !form.zipCode?.trim() ||
    !form.address ||
    !form.address?.trim()
  ) {
    errors.address = errors.address ?? []
    errors.address.push('주소를 입력하세요.')
    hasErrors = true
  }
  // 필수 항목 검증 E
  // 비밀번호와 비밀번호 확인 일치여부
  if (form?.password && form?.password !== form?.confirmPassword) {
    errors.confirmPassword = errors.confirmPassword ?? []
    errors.confirmPassword.push('비밀번호가 일치하지 않습니다.')
    hasErrors = true
  }

  /* 서버 요청 처리 S */
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
        errors = result.message
      }
    } catch (err) {
      console.error(err)
    }
  }
  /* 서버 요청 처리 E */

  if (hasErrors) {
    return errors
  }

  // 회원 가입 완료 후 이동
  redirect(redirectUrl)
}

/**
 * 로그인 처리
 *
 * @param params
 * @param formData
 */
export const processLogin = async (params, formData: FormData) => {
  const redirectUrl = params?.redirectUrl ?? '/'

  let errors = {}
  let hasErrors = false

  // 필수 항목 검증 S
  const email = formData.get('email')
  const password = formData.get('password')
  if (!email || !email.trim()) {
    errors.email = errors.email ?? []
    errors.email.push('이메일을 입력하세요.')
    hasErrors = true
  }

  if (!password || !password.trim()) {
    errors.password = errors.password ?? []
    errors.password.push('비밀번호를 입력하세요.')
    hasErrors = true
  }

  // 필수 항목 검증 E

  // 서버 요청 처리 S
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
        // 회원 인증 성공
        const cookie = await cookies()
        cookie.set('token', result.data, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          path: '/',
        })
      } else {
        // 회원 인증 실패
        errors = result.message
        hasErrors = true
      }
    } catch (err) {
      console.error(err)
    }
  }
  // 서버 요청 처리 E

  if (hasErrors) {
    return errors
  }

  // 캐시 비우기
  revalidatePath('/', 'layout')

  // 로그인 성공시 이동
  redirect(redirectUrl, RedirectType.replace)
}

/**
 * 로그인한 회원 정보를 조회
 *
 */
export const getUserInfo = async () => {
  const cookie = await cookies()
  if (!cookie.has('token')) return

  try {
    const res = await apiRequest('/member')
    if (res.status === 200) {
      const result = await res.json()
      return result.success && result.data
    }
  } catch (err) {
    console.error(err)
  }
}
