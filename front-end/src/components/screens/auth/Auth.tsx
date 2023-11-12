'use client'

import { Button } from '@/components/ui/button/Button'
import Field from '@/components/ui/field/Field'
import { getRandomFullName } from '@/utils/get-random-full-name.util'
import { AtSign, KeyRound } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { IAuthFormState } from './auth.types'

interface IAuth {
	type?: 'Login' | 'Register'
}

export function Auth({ type }: IAuth) {
	const [isLoading, setIsLoading] = useState(false)
	const { register, handleSubmit } = useForm<IAuthFormState>({
		mode: 'onChange',
	})

	const { push } = useRouter()

	const onSubmit: SubmitHandler<IAuthFormState> = async data => {
		setIsLoading(true)
		const response = await signIn(
			'credentials',
			type === 'Login'
				? {
						redirect: false,
						...data,
				  }
				: {
						redirect: false,
						username: getRandomFullName(),
						...data,
				  }
		)

		if (response?.error) {
			toast.error(response.error)
			setIsLoading(false)
			return
		}

		setIsLoading(false)
		push('/')
	}

	return (
		<div className='flex w-screen h-full'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='m-auto block w-96 border border-border p-8'
			>
				<h1 className='text-center mb-10'>{type}</h1>
				<Field
					{...register('email', {
						required: true,
					})}
					placeholder='Enter email'
					type='email'
					Icon={AtSign}
					className='mb-8'
				/>
				<Field
					{...register('password', {
						required: true,
						minLength: {
							value: 6,
							message: 'Min length 6 symbols!',
						},
					})}
					placeholder='Enter password'
					type='password'
					Icon={KeyRound}
					className='mb-12'
				/>

				<div className='text-center'>
					<Button isLoading={isLoading} disabled={isLoading} type='submit'>
						{type}
					</Button>
				</div>
			</form>
		</div>
	)
}
