import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('ConversationDto', {
    id: SwaggerDocument.ApiProperty({ type: 'string' }),
    participants: SwaggerDocument.ApiProperty({ type: 'array' }),
    createdAt: SwaggerDocument.ApiProperty({ type: 'string' }),
    updatedAt: SwaggerDocument.ApiProperty({ type: 'string' }),
});

export const ConversationDto = conversation => ({
    id: conversation.id,
    participants: conversation.participants || [],
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
});