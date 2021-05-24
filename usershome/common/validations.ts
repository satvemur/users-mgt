import { Validators } from '@angular/forms'

export const EmailValidation = [Validators.required, Validators.email]
export const OptionalTextValidation = [Validators.minLength(2), Validators.maxLength(100)]
export const RequiredTextValidation = OptionalTextValidation.concat([Validators.required])
export const OneCharValidation = [Validators.minLength(1), Validators.maxLength(1)]
