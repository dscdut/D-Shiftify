import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const ResetPasswordInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({ // Ma OTP phai co dung 6 chu so
            'string.length': 'OTP must be exactly 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
        }),
        new_password: Joi.string().min(8).required().messages({ // Mat khau phai co it nhat 8 ky tu
            'string.min': 'Password must be at least 8 characters',
        }),
    })
);
