import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('CreateMessageDto', {
    content: SwaggerDocument.ApiProperty({
        type: 'string',
        required: false,
    }),
    voiceUrl: SwaggerDocument.ApiProperty({
        type: 'string',
        required: false,
    }),
    type: SwaggerDocument.ApiProperty({
        type: 'string',
        example: 'text',
    }),
});

export const CreateMessageDto = body => ({
    content: body.content,
    voiceUrl: body.voiceUrl,
    type: body.type,
});
