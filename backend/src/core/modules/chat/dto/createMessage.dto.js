import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('CreateMessageDto', {
    conversationId: SwaggerDocument.ApiProperty({ type: 'string' }),
    content: SwaggerDocument.ApiProperty({ type: 'string' }),
    voiceUrl: SwaggerDocument.ApiProperty({type: 'string',required: false }),
});

export const CreateMessageDto = body => ({
    conversation_id: body.conversationId,
    content: body.content,
    voice_url: body.voiceUrl || null,
});