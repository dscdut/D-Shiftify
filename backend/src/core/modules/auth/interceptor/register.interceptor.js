import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const RegisterInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        email: JoiUtils.email().required(),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({ // So dien thoai tu 10-11 chu so
            'string.pattern.base': 'Phone must be 10-11 digits',
        }),
        password: Joi.string().min(8).required().messages({ // Mat khau it nhat 8 ky tu
            'string.min': 'Password must be at least 8 characters',
        }),
        role: Joi.string().valid('candidate', 'recruiter', 'training_center').required(),
        full_name: JoiUtils.requiredString(),
    })
);
