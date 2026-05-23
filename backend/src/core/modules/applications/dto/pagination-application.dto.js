import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('PaginationApplicationDto', {
    data: SwaggerDocument.ApiProperty({
        type: 'array',
        model: 'ApplicationDto',
    }),
    totalPages: SwaggerDocument.ApiProperty({ type: 'int', readOnly: true }),
    totalElements: SwaggerDocument.ApiProperty({ type: 'int', readOnly: true }),
});

export const PaginationApplicationDto = pageable => ({
    data: pageable.content,
    totalPages: Math.ceil(pageable.total / pageable.size),
    totalElements: pageable.total,
});