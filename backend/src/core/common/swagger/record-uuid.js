import { SwaggerDocument } from 'packages/swagger';

export const RecordUuid = SwaggerDocument.ApiParams({
    name: 'id',
    paramsIn: 'path',
    type: 'string',
    description: 'Record Id (UUID)',
});