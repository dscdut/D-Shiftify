import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('MessageDto', {
    id: SwaggerDocument.ApiProperty({ type: 'string' }),
    conversationId: SwaggerDocument.ApiProperty({ type: 'string' }),
    senderId: SwaggerDocument.ApiProperty({ type: 'string' }),
    content: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    voiceUrl: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    createdAt: SwaggerDocument.ApiProperty({ type: 'string' }),
});

export const MessageDto = message => ({
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    voiceUrl: message.voiceUrl,
    createdAt: message.createdAt,
});