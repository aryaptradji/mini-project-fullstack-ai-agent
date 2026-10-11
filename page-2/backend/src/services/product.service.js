import * as repo from '../repositories/product.repository.js';
import { AppError } from '../errors/app-error.js';
import { validateProduct } from '../schemas/product.schema.js';
export function parseId(value) { if(!/^[1-9]\d*$/.test(value || '')) throw new AppError(400,'Bad Request','Product ID must be a positive safe integer.'); const n=Number(value); if(!Number.isSafeInteger(n)) throw new AppError(400,'Bad Request','Product ID must be a positive safe integer.'); return n; }
function payload(body) {
 const v=validateProduct(body);
 if(!v.success) throw Object.assign(new AppError(400,'Validation Error','Request body validation failed.',v.errors),{status:400});
 if(v.data.name.toLowerCase()==='mw75 tumi') {
   const firstColor=v.data.variants.find(x=>x.type==='color');
   const hero=firstColor?.images.find(x=>x.role==='hero')?.url;
   if(firstColor?.value.toLowerCase()!=='black') throw Object.assign(new AppError(400,'Validation Error','Request body validation failed.',[{field:'variants',message:'MW75 default color variant must be Black.'}]),{status:400});
   if(!hero || hero!==v.data.image) throw Object.assign(new AppError(400,'Validation Error','Request body validation failed.',[{field:'image',message:'Must match the hero image of the first color variant.'}]),{status:400});
 }
 return v.data;
}
export const list=()=>repo.listProducts();
export async function detail(rawId){const p=await repo.findProduct(parseId(rawId));if(!p)throw new AppError(404,'Not Found','Product was not found.');return p;}
export const create=(body)=>repo.createProduct(payload(body));
export async function replace(rawId,body){const p=await repo.replaceProduct(parseId(rawId),payload(body));if(!p)throw new AppError(404,'Not Found','Product was not found.');return p;}
export async function remove(rawId){if(!await repo.deleteProduct(parseId(rawId)))throw new AppError(404,'Not Found','Product was not found.');}
