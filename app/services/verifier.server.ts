import { VerifyEmailFunction } from 'remix-auth-email-link'
import { isEmailBurner } from 'burner-email-providers'
import { validateEmail } from '~/utils'

export let verifyEmailAddress: VerifyEmailFunction = async (email) => {
  if (!validateEmail(email)) throw new Error('Invalid email address.')
  if (isEmailBurner(email)) throw new Error('Email not allowed.')
}