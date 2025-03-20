import { Transition } from '@headlessui/react';
import { EnvelopeSimple } from '@phosphor-icons/react';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';

import Link from 'next/link';
import { LanguageContext } from '../../contexts/LanguageContext';
import { snakeToCamel } from '../../functions/snakeToCamel';
import { useRequest } from '../../hooks/useRequest';
import { Button } from '../Button';
import { Field } from '../Field';
import { Notification } from '../Notification';

export function SendMailForm() {
  const { language: { translation } } = useContext(LanguageContext)
  const { request, execute } = useRequest();

  const [email, setEmail] = useState('')
  const [hasSentForm, setHasSentForm] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if(hasSentForm) return

    execute({
      url: '/recover/mail',
      method: 'POST',
      data: { email },
    })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setEmail(value)
  }
  
  useEffect(() => {
    if (request.status === 'success') {
      setHasSentForm(true)
    }
  }, [request.status])
  
  const isRequesting = request.status === 'loading';
  const error = request.error && translation.errors[snakeToCamel(request.error) as keyof typeof translation.errors]

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-[75%] relative'
      autoComplete='off'
    >
      <Transition
        show={!hasSentForm}
        leave='transition-all duration-500'
        leaveFrom='opacity-100 translate-x-0'
        leaveTo='opacity-0 -translate-x-full absolute'
        className='flex flex-col gap-2'
      >
        {request.error && (
          <Notification type='error'>
            {error}
          </Notification>
        )}

        <p className='text-sm text-center text-zinc-300'>
          {translation.forgot.description}
        </p>

        <Field
          className='mt-4'
          type='email'
          id='email'
          placeholder={translation.email}
          value={email}
          icon={EnvelopeSimple}
          onChange={handleChange}
        />

        <Button
          type='submit'
          disabled={isRequesting}
        >
          {translation.forgot.submit}
        </Button>

        <Link href="/login" className='text-center bg-neutral-800 py-2.5 rounded-xl'>
          {translation.forgot.backToLogin}
        </Link>
      </Transition>

      <Transition
        show={hasSentForm}
        enter='transition-all duration-500'
        enterFrom='opacity-0 translate-x-full'
        enterTo='opacity-100 translate-x-0'
        className='text-base text-center text-zinc-300'
      >
        <p>{translation.forgot.checkEmail}</p>
      </Transition>
		</form >
	);
}