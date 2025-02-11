'use client'
import React, { ChangeEvent } from 'react'
import Messages from '@/app/global/components/Messages'
import styled from 'styled-components'
import {
  MdRadioButtonUnchecked,
  MdRadioButtonChecked,
  MdCheckBoxOutlineBlank,
  MdCheckBox,
} from 'react-icons/md'
import { SmallButton, BigButton } from '@/app/global/components/Buttons'
import { Input } from '@/app/global/components/FormComponents'
import DatePicker from 'react-datepicker'

// form 데이터 타입 정의
type FormType = {
  email: string
  password: string
  confirmPassword: string
  name: string
  zipCode: string
  address: string
  addressSub: string
  phoneNumber: string
  gender: 'MALE' | 'FEMALE'
  birthDt: string | null
  requiredTerms1: boolean
  requiredTerms2: boolean
  requiredTerms3: boolean
  optionalTerms: string
}

// actionState 타입 정의
type ActionState = [Record<string, string>, string | null, boolean]

// onClick의 value에 대해 가능한 값들 정의
type ClickValue = keyof FormType | string

type JoinFormProps = {
  form: FormType
  onClick: (field: keyof FormType, value: ClickValue) => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSelectDate: (date: Date | [Date, Date] | null) => void
  actionState: ActionState
}

const StyledForm = styled.form``

const JoinForm = ({
  form,
  onClick,
  onChange,
  onSelectDate,
  actionState,
}: JoinFormProps) => {
  const [errors, formAction, isPending] = actionState

  return (
    <>
      <StyledForm action={formAction} autoComplete="off">
        <input type="hidden" name="gender" defaultValue={form?.gender ?? ''} />
        <input
          type="hidden"
          name="birthDt"
          defaultValue={form?.birthDt ?? ''}
        />
        <input
          type="hidden"
          name="requiredTerms1"
          defaultValue={form?.requiredTerms1 ? 'true' : 'false'}
        />
        <input
          type="hidden"
          name="requiredTerms2"
          defaultValue={form?.requiredTerms2 ? 'true' : 'false'}
        />
        <input
          type="hidden"
          name="requiredTerms3"
          defaultValue={form?.requiredTerms3 ? 'true' : 'false'}
        />
        <input
          type="hidden"
          name="optionalTerms"
          defaultValue={form?.optionalTerms ?? ''}
        />

        <Input
          type="text"
          name="email"
          placeholder="이메일"
          value={form?.email ?? ''}
          onChange={onChange}
        />
        <Messages color="danger">{errors?.email}</Messages>

        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form?.password ?? ''}
          onChange={onChange}
        />
        <Messages color="danger">{errors?.password}</Messages>

        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form?.confirmPassword ?? ''}
          onChange={onChange}
        />
        <Messages color="danger">{errors?.confirmPassword}</Messages>

        <Input
          type="text"
          name="name"
          placeholder="이름"
          value={form?.name ?? ''}
          onChange={onChange}
        />
        <Messages color="danger">{errors?.name}</Messages>

        <div className="address-row">
          <Input
            type="text"
            name="zipCode"
            placeholder="우편번호"
            value={form?.zipCode ?? ''}
            onChange={onChange}
          />
          <SmallButton type="button">주소찾기</SmallButton>
        </div>

        <Input
          type="text"
          name="address"
          placeholder="집주소"
          value={form?.address ?? ''}
          onChange={onChange}
        />
        <Input
          type="text"
          name="addressSub"
          placeholder="나머지 주소"
          value={form?.addressSub ?? ''}
          onChange={onChange}
        />
        <Messages color="danger">{errors?.address}</Messages>

        <Input
          type="text"
          name="phoneNumber"
          placeholder="휴대폰번호"
          value={form?.phoneNumber ?? ''}
          onChange={onChange}
        />
        <Messages color="danger">{errors?.phoneNumber}</Messages>

        <div className="row">
          <div className="tit">성별</div>
          <div className="radio-buttons">
            <span onClick={() => onClick('gender', 'FEMALE')}>
              {form?.gender === 'FEMALE' ? (
                <MdRadioButtonChecked />
              ) : (
                <MdRadioButtonUnchecked />
              )}
              여성
            </span>
            <span onClick={() => onClick('gender', 'MALE')}>
              {form?.gender === 'MALE' ? (
                <MdRadioButtonChecked />
              ) : (
                <MdRadioButtonUnchecked />
              )}
              남성
            </span>
          </div>
        </div>
        <Messages color="danger">{errors?.gender}</Messages>

        <div className="row">
          <div className="tit">생년월일</div>
          <div>
            <DatePicker
              selected={form?.birthDt ? new Date(form.birthDt) : null}
              onChange={(date: Date | [Date, Date] | null) =>
                onSelectDate(date)
              }
            />
          </div>
        </div>
        <Messages color="danger">{errors?.birthDt}</Messages>

        <div className="terms">
          <div
            className="terms-row"
            onClick={() =>
              onClick('requiredTerms1', String(!form?.requiredTerms1))
            }
          >
            {form?.requiredTerms1 ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            이용약관에 동의합니다.
          </div>
          <Messages color="danger">{errors?.requiredTerms1}</Messages>

          <div
            className="terms-row"
            onClick={() =>
              onClick('requiredTerms2', String(!form?.requiredTerms2))
            }
          >
            {form?.requiredTerms2 ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            개인정보 처리방침에 동의합니다.
          </div>
          <Messages color="danger">{errors?.requiredTerms2}</Messages>

          <div
            className="terms-row"
            onClick={() =>
              onClick('requiredTerms3', String(!form?.requiredTerms3))
            }
          >
            {form?.requiredTerms3 ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            개인정보 수집 및 이용에 동의합니다.
          </div>
        </div>

        <div
          className="terms-row"
          onClick={() =>
            onClick('optionalTerms', form?.optionalTerms ? '' : 'advertisement')
          }
        >
          {form?.optionalTerms ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          광고성 정보 전송에 동의합니다.(선택)
        </div>

        <BigButton type="submit" disabled={isPending} className="submit-btn">
          가입하기
        </BigButton>
      </StyledForm>
    </>
  )
}

export default React.memo(JoinForm)
