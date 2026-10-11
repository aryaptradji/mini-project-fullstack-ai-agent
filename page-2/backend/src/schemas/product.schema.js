import { z } from 'zod';
const text = (max) => z.string().trim().min(1).max(max);
const url = z.string().url().refine(v => ['http:', 'https:'].includes(new URL(v).protocol), 'URL must use HTTP or HTTPS');
const position = z.number().int().nonnegative().optional();
const image = z.object({ role: text(40), url, alt: text(240), position }).strict();
const variant = z.object({ type: z.enum(['color','size']), value: text(100), quantity: z.number().int().nonnegative().safe(), images: z.array(image).min(1), position }).strict();
const schema = z.object({
 name: text(160), subtitle: text(240), brand: text(120), price: z.number().int().nonnegative().safe(), currency: z.string().regex(/^[A-Z]{3}$/), image: url, description: text(5000),
 variants: z.array(variant).min(1), highlights: z.array(z.object({ title:text(160), description:text(1000), icon:text(120), position }).strict()),
 services: z.array(z.object({ title:text(160), description:text(1000), position }).strict()),
 collaboration: z.object({ title:text(200), description:text(2000), image:url, imageAlt:text(240) }).strict().nullable(),
 specificationGroups: z.array(z.object({ title:text(160), items:z.array(z.object({ label:text(160), value:text(1000), position }).strict()), position }).strict()),
 boxItems: z.array(z.object({ name:text(160), image:url, imageAlt:text(240), position }).strict())
}).strict().superRefine((p, ctx) => {
 const seen = new Set();
 p.variants.forEach((v, i) => {
   const key = `${v.type}:${v.value.toLocaleLowerCase()}`;
   if (seen.has(key)) ctx.addIssue({ code:'custom', path:['variants',i,'value'], message:'Variant type and value must be unique (case-insensitive)' });
   seen.add(key);
   const roles = new Set(); v.images.forEach((im,j) => { const role=im.role.toLowerCase(); if (roles.has(role)) ctx.addIssue({ code:'custom', path:['variants',i,'images',j,'role'], message:'Image roles must be unique within a variant (case-insensitive)' }); roles.add(role); });
   if (p.name.toLowerCase() === 'mw75 tumi' && v.type === 'color' && ['hero','front','engraving','straight'].some(r => !roles.has(r))) ctx.addIssue({ code:'custom', path:['variants',i,'images'], message:'MW75 color variants require hero, front, engraving, and straight images' });
 });
});
export function validateProduct(input) {
 const result = schema.safeParse(input);
 if (!result.success) return { success:false, errors:result.error.issues.map(i => ({ field:i.path.join('.'), message:i.message })) };
 return { success:true, data:result.data };
}
export const productSchema = schema;
