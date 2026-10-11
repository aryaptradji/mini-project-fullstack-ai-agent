import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
import SwaggerParser from '@apidevtools/swagger-parser';
const source=new URL('../schemas/openapi.yaml',import.meta.url);
const spec=YAML.parse(await readFile(source,'utf8'));
if(spec.openapi!=='3.1.0'||!spec.paths?.['/api/products']||!spec.components?.schemas?.Problem) throw new Error('OpenAPI spec is missing required API components');
await SwaggerParser.validate(spec);
console.log('OpenAPI 3.1 document and references validated');
