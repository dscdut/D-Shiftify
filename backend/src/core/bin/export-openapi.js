import fs from 'fs';
import path from 'path';
import { ApiDocument } from '../config/swagger.config';
import { logger } from '../../packages/logger';

const outputPath = path.join(process.cwd(), 'openapi.json');

fs.writeFileSync(
    outputPath,
    JSON.stringify(ApiDocument.instance, null, 2),
    'utf8',
);

logger.info(`OpenAPI spec exported to ${outputPath}`);
