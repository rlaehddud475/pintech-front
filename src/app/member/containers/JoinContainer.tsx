// src/app/member/containers/JoinContainer.tsx
'use client'
import JoinForm from '../components/JoinForm'
import { useSearchParams } from 'next/navigation'
import React, { useState, useCallback } from 'react'
import { processJoin } from '../services/actions'

const JoinContainer = () => {
  const searchParams = useSearchParams()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formAction, setFormAction] = useState<string | null>(null)
  const [isPending, setIsPending] = useState<boolean>(false)

  // form을 FormType에 맞게 초기화
  const [form, setForm] = useState({
    gender: 'FEMALE' as 'MALE' | 'FEMALE',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    zipCode: '',
    address: '',
    addressSub: '',
    phoneNumber: '',
    birthDt: '',
    requiredTerms1: false,
    requiredTerms2: false,
    requiredTerms3: false,
    optionalTerms: 'false',
  })

  const onChange = useCallback((e) => {
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }))
  }, [])

  const onClick = useCallback((field, value) => {
    setForm((form) => ({ ...form, [field]: value }))
  }, [])

  const onSelectDate = useCallback((date) => {
    setForm((form) => ({
      ...form,
      birthDt: date,
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 폼 기본 제출 동작 방지
    setIsPending(true)
    try {
      const formData = new FormData()

      // form 데이터를 formData에 추가
      for (const key in form) {
        formData.append(key, form[key])
      }

      // searchParams를 FormData로 변환 후 추가
      searchParams.forEach((value, key) => {
        formData.append(key, value as string)
      })

      // processJoin에 하나의 FormData만 전달
      await processJoin(searchParams, formData)
      setFormAction('success')
    } catch (err) {
      setErrors({ form: '서버 오류가 발생했습니다.' })
      setFormAction('error')
      console.error(err)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <JoinForm
      actionState={[errors, formAction, isPending]}
      form={form}
      onChange={onChange}
      onClick={onClick}
      onSelectDate={onSelectDate}
      onSubmit={handleSubmit} // handleSubmit 전달
    />
  )
}

export default React.memo(JoinContainer)
