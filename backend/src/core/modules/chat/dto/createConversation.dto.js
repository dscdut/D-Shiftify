import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('CreateConversationDto', {
    participantIds: SwaggerDocument.ApiProperty({
        type: 'array',
        example: [
            '11111111-1111-1111-1111-111111111111',
            '22222222-2222-2222-2222-222222222222',
        ],
    }),
});

export const CreateConversationDto = body => ({
    participantIds: Array.isArray(body.participantIds)
        ? body.participantIds
        : [],
});
