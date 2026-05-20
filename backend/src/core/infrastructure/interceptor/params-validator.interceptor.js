import { AbstractInputValidatorInterceptor } from './input-validator.interceptor';

export class ParamsValidatorInterceptor extends AbstractInputValidatorInterceptor {
    schema;

    constructor(schema) {
        super();
        this.schema = schema;
    }

    getSchema(req) {
        return this.schema;
    }

    getValueToValidate(req) {
        return req.params;
    }
}
