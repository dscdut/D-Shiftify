import { AbstractInputValidatorInterceptor } from 'core/infrastructure/interceptor/input-validator.interceptor';

export class ParamsValidatorInterceptor extends AbstractInputValidatorInterceptor {
    constructor(schema) {
        super();
        this.schema = schema;
    }

    getSchema() {
        return this.schema;
    }

    getValueToValidate(req) {
        return req.params;
    }
}
