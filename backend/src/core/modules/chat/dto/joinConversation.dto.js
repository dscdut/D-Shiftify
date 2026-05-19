import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('JoinConversationDto', {
    conversationId: SwaggerDocument.ApiProperty({type: 'string',}),
});

export const JoinConversationDto = body => ({
    conversation_id: body.conversationId,
});