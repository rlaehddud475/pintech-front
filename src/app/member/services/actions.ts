'use server'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'

export const processJoin = async (params, formData: FormData) => {
  //   const redirectUrl = parms?.get('redirectUrl') ?? '/memeber/login'
  const redirectUrl = '/member/login'
  const form = {},
    errors = {}
  let hasErrors = false
  for (let [key, value] of formData.entries()) {
    if (key.includes('$ACTION')) continue
    if (key === 'birthDt' && value && value.trim()) {
      value = format(new Date(value), 'yyyy-MM-dd')
    }
    if (['false', 'true'].includes(value)) {
      value = value === 'true'
    }
    form[key] = value
  }
  const requiredFields = {
    email: '이메일을 입력하세요.',
    name: '이름을 입력하세요.',
    passwrod: '비밀번호를 입력하세요.',
    confirmPassword: '비밀번호를 확인하세요.',
    phoneNumber: '휴대폰번호를 입력하세요.',
    gender: '성별을 선택하세요',
    birthDt: '생년월일을 선택하세요',
    requiredTerms1: '이용약관에 동의하셔야 합니다.',
    requiredTerms2: '개인정보 처리방침에 동의하셔야 합니다',
    requiredTerms3: '개인정보 수집 및 이용에 동의하셔야 합니다.',
  }
  for (const [field, msg] of Object.entries(requiredFields)) {
    if (!form[field] || !form[field].trim()) {
      errors[field] = errors[field] ?? []
      errors[field].push(msg)
      hasErrors = true
    }
  }
  if (
    !form.zipCode ||
    !form.zipCode.trim() ||
    !form.address ||
    !form.address.trim()
  ) {
    errors.address = errors.address ?? []
    errors.address.push('주소를 입력하세요.')
    hasErrors = true
  }
  if (hasErrors) {
    return errors
  }
  console.log('form', form)
  redirect(redirectUrl)
}
export const processLogin = async (params, formData: FormData) => {}
