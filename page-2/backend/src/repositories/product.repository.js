import { pool } from '../config/database.js';

const ordered = async (client, sql, id) => (await client.query(sql, [id])).rows;
function mapDetail(p, variants, highlights, services, collaboration, groups, boxItems) {
 const hero = variants.flatMap(v => v.images).find(i => i.role === 'hero');
 return { id:Number(p.id), name:p.name, subtitle:p.subtitle, brand:p.brand, price:Number(p.price), currency:p.currency.trim(), image:hero?.url || p.image_url, description:p.description,
   variants, highlights, services, collaboration, specificationGroups:groups, boxItems };
}
export async function getDetail(id, client=pool) {
 const { rows } = await client.query('SELECT * FROM products WHERE id=$1', [id]); if (!rows[0]) return null;
 const p=rows[0];
 const vs=await ordered(client,'SELECT * FROM product_variants WHERE product_id=$1 ORDER BY position,id',id);
 const imgs=await ordered(client,'SELECT i.* FROM variant_images i JOIN product_variants v ON v.id=i.variant_id WHERE v.product_id=$1 ORDER BY i.position,i.id',id);
 const variants=vs.map(v=>({id:Number(v.id),type:v.variant_type,value:v.value,quantity:v.quantity,images:imgs.filter(i=>i.variant_id===v.id).map(i=>({role:i.role,url:i.image_url,alt:i.alt_text}))}));
 const highlights=(await ordered(client,'SELECT * FROM product_highlights WHERE product_id=$1 ORDER BY position,id',id)).map(x=>({title:x.title,description:x.description,icon:x.icon}));
 const services=(await ordered(client,'SELECT * FROM product_services WHERE product_id=$1 ORDER BY position,id',id)).map(x=>({title:x.title,description:x.description}));
 const c=(await ordered(client,'SELECT * FROM product_collaborations WHERE product_id=$1',id))[0];
 const gs=await ordered(client,'SELECT * FROM product_specification_groups WHERE product_id=$1 ORDER BY position,id',id);
 const items=(await client.query('SELECT i.* FROM product_specification_items i JOIN product_specification_groups g ON g.id=i.group_id WHERE g.product_id=$1 ORDER BY i.position,i.id',[id])).rows;
 const groups=gs.map(g=>({title:g.title,items:items.filter(i=>i.group_id===g.id).map(i=>({label:i.label,value:i.value}))}));
 const boxItems=(await ordered(client,'SELECT * FROM product_box_items WHERE product_id=$1 ORDER BY position,id',id)).map(x=>({name:x.name,image:x.image_url,imageAlt:x.image_alt}));
 return mapDetail(p,variants,highlights,services,c?{title:c.title,description:c.description,image:c.image_url,imageAlt:c.image_alt}:null,groups,boxItems);
}
async function insertChildren(client,id,p) {
 for (const [n,v] of p.variants.entries()) {
  const r=await client.query('INSERT INTO product_variants(product_id,variant_type,value,quantity,position) VALUES($1,$2,$3,$4,$5) RETURNING id',[id,v.type,v.value,v.quantity,v.position??n]);
  for (const [j,i] of v.images.entries()) await client.query('INSERT INTO variant_images(variant_id,role,image_url,alt_text,position) VALUES($1,$2,$3,$4,$5)',[r.rows[0].id,i.role,i.url,i.alt,i.position??j]);
 }
 for (const [n,h] of p.highlights.entries()) await client.query('INSERT INTO product_highlights(product_id,title,description,icon,position) VALUES($1,$2,$3,$4,$5)',[id,h.title,h.description,h.icon,h.position??n]);
 for (const [n,s] of p.services.entries()) await client.query('INSERT INTO product_services(product_id,title,description,position) VALUES($1,$2,$3,$4)',[id,s.title,s.description,s.position??n]);
 if(p.collaboration) await client.query('INSERT INTO product_collaborations(product_id,title,description,image_url,image_alt) VALUES($1,$2,$3,$4,$5)',[id,p.collaboration.title,p.collaboration.description,p.collaboration.image,p.collaboration.imageAlt]);
 for(const [n,g] of p.specificationGroups.entries()) { const gr=await client.query('INSERT INTO product_specification_groups(product_id,title,position) VALUES($1,$2,$3) RETURNING id',[id,g.title,g.position??n]); for(const [j,i] of g.items.entries()) await client.query('INSERT INTO product_specification_items(group_id,label,value,position) VALUES($1,$2,$3,$4)',[gr.rows[0].id,i.label,i.value,i.position??j]); }
 for(const [n,b] of p.boxItems.entries()) await client.query('INSERT INTO product_box_items(product_id,name,image_url,image_alt,position) VALUES($1,$2,$3,$4,$5)',[id,b.name,b.image,b.imageAlt,b.position??n]);
}
export async function createProduct(p) {
 const c=await pool.connect(); try { await c.query('BEGIN'); const r=await c.query('INSERT INTO products(name,subtitle,brand,price,currency,description,image_url) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',[p.name,p.subtitle,p.brand,p.price,p.currency,p.description,p.image]); await insertChildren(c,r.rows[0].id,p); await c.query('COMMIT'); return await getDetail(r.rows[0].id); } catch(e){await c.query('ROLLBACK');throw e;} finally{c.release();}
}
export async function replaceProduct(id,p) {
 const c=await pool.connect(); try { await c.query('BEGIN'); const r=await c.query('UPDATE products SET name=$2,subtitle=$3,brand=$4,price=$5,currency=$6,description=$7,image_url=$8,updated_at=now() WHERE id=$1',[id,p.name,p.subtitle,p.brand,p.price,p.currency,p.description,p.image]); if(!r.rowCount){await c.query('ROLLBACK');return null;} await c.query('DELETE FROM product_variants WHERE product_id=$1',[id]); await c.query('DELETE FROM product_highlights WHERE product_id=$1',[id]); await c.query('DELETE FROM product_services WHERE product_id=$1',[id]); await c.query('DELETE FROM product_collaborations WHERE product_id=$1',[id]); await c.query('DELETE FROM product_specification_groups WHERE product_id=$1',[id]); await c.query('DELETE FROM product_box_items WHERE product_id=$1',[id]); await insertChildren(c,id,p); await c.query('COMMIT'); return await getDetail(id); } catch(e){await c.query('ROLLBACK');throw e;} finally{c.release();}
}
export async function deleteProduct(id) { const r=await pool.query('DELETE FROM products WHERE id=$1',[id]); return r.rowCount>0; }
export async function listProducts() { const r=await pool.query("SELECT p.id,p.name,p.price,p.currency,COALESCE((SELECT image_url FROM variant_images i JOIN product_variants v ON v.id=i.variant_id WHERE v.product_id=p.id AND i.role='hero' ORDER BY v.position LIMIT 1),p.image_url) AS image FROM products p ORDER BY p.id"); return r.rows.map(p=>({id:Number(p.id),name:p.name,price:Number(p.price),currency:p.currency.trim(),image:p.image})); }
export async function findProduct(id) { return getDetail(id); }
