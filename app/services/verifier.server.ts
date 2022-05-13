import { VerifyEmailFunction } from 'remix-auth-email-link'
import { isEmailBurner } from 'burner-email-providers'
import { validateEmail } from '~/utils'
import { getUserByEmail } from '~/models/user.server'

export let verifyEmailAddress: VerifyEmailFunction = async (email) => {
  let user = await getUserByEmail(email);
  if (!user) throw new Error('User not found.')
  if (!validateEmail(email)) throw new Error('Invalid email address.')
  if (isEmailBurner(email)) throw new Error('User not found.')
}