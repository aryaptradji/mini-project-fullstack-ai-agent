import { pool } from '../config/database.js';

const query = async (client, sql, params = []) => (await client.query(sql, params)).rows;

const byProduct = (client, table, id, order = 'ORDER BY position, id') =>
  query(client, `SELECT * FROM ${table} WHERE product_id=$1 ${order}`, [id]);

async function insert(client, table, data, returnId = false) {
  const cols = Object.keys(data);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(',');
  const sql = `INSERT INTO ${table}(${cols.join(',')}) VALUES(${placeholders})${returnId ? ' RETURNING id' : ''}`;
  const rows = await query(client, sql, Object.values(data));
  return rows[0]?.id;
}

async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query(result === null ? 'ROLLBACK' : 'COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

const CHILD_TABLES = [
  'product_variants',
  'product_highlights',
  'product_services',
  'product_collaborations',
  'product_specification_groups',
  'product_box_items',
];

const productColumns = (p) => ({
  name: p.name,
  subtitle: p.subtitle,
  brand: p.brand,
  price: p.price,
  currency: p.currency,
  description: p.description,
  image_url: p.image,
});

// ---------- read ----------

export async function getDetail(id, client = pool) {
  const [product] = await query(client, 'SELECT * FROM products WHERE id=$1', [id]);
  if (!product) return null;

  const [variantRows, imageRows, highlightRows, serviceRows, collabRows, groupRows, itemRows, boxRows] =
    await Promise.all([
      byProduct(client, 'product_variants', id),
      query(
        client,
        `SELECT i.* FROM variant_images i
         JOIN product_variants v ON v.id=i.variant_id
         WHERE v.product_id=$1 ORDER BY i.position, i.id`,
        [id]
      ),
      byProduct(client, 'product_highlights', id),
      byProduct(client, 'product_services', id),
      byProduct(client, 'product_collaborations', id, ''),
      byProduct(client, 'product_specification_groups', id),
      query(
        client,
        `SELECT i.* FROM product_specification_items i
         JOIN product_specification_groups g ON g.id=i.group_id
         WHERE g.product_id=$1 ORDER BY i.position, i.id`,
        [id]
      ),
      byProduct(client, 'product_box_items', id),
    ]);

  const variants = variantRows.map((v) => ({
    id: Number(v.id),
    type: v.variant_type,
    value: v.value,
    quantity: v.quantity,
    images: imageRows
      .filter((i) => i.variant_id === v.id)
      .map((i) => ({ role: i.role, url: i.image_url, alt: i.alt_text })),
  }));

  const collab = collabRows[0];
  const hero = variants.flatMap((v) => v.images).find((i) => i.role === 'hero');

  return {
    id: Number(product.id),
    name: product.name,
    subtitle: product.subtitle,
    brand: product.brand,
    price: Number(product.price),
    currency: product.currency.trim(),
    image: hero?.url || product.image_url,
    description: product.description,
    variants,
    highlights: highlightRows.map((x) => ({ title: x.title, description: x.description, icon: x.icon })),
    services: serviceRows.map((x) => ({ title: x.title, description: x.description })),
    collaboration: collab
      ? { title: collab.title, description: collab.description, image: collab.image_url, imageAlt: collab.image_alt }
      : null,
    specificationGroups: groupRows.map((g) => ({
      title: g.title,
      items: itemRows.filter((i) => i.group_id === g.id).map((i) => ({ label: i.label, value: i.value })),
    })),
    boxItems: boxRows.map((x) => ({ name: x.name, image: x.image_url, imageAlt: x.image_alt })),
  };
}

export const findProduct = (id) => getDetail(id);

export async function listProducts() {
  const rows = await query(
    pool,
    `SELECT p.id, p.name, p.price, p.currency,
            COALESCE(
              (SELECT image_url FROM variant_images i
               JOIN product_variants v ON v.id=i.variant_id
               WHERE v.product_id=p.id AND i.role='hero'
               ORDER BY v.position LIMIT 1),
              p.image_url
            ) AS image
     FROM products p
     ORDER BY p.id`
  );
  return rows.map((p) => ({
    id: Number(p.id),
    name: p.name,
    price: Number(p.price),
    currency: p.currency.trim(),
    image: p.image,
  }));
}

// ---------- write ----------

async function insertChildren(client, id, p) {
  for (const [n, v] of p.variants.entries()) {
    const variantId = await insert(
      client,
      'product_variants',
      { product_id: id, variant_type: v.type, value: v.value, quantity: v.quantity, position: v.position ?? n },
      true
    );
    for (const [j, i] of v.images.entries()) {
      await insert(client, 'variant_images', {
        variant_id: variantId,
        role: i.role,
        image_url: i.url,
        alt_text: i.alt,
        position: i.position ?? j,
      });
    }
  }

  for (const [n, h] of p.highlights.entries()) {
    await insert(client, 'product_highlights', {
      product_id: id,
      title: h.title,
      description: h.description,
      icon: h.icon,
      position: h.position ?? n,
    });
  }

  for (const [n, s] of p.services.entries()) {
    await insert(client, 'product_services', {
      product_id: id,
      title: s.title,
      description: s.description,
      position: s.position ?? n,
    });
  }

  if (p.collaboration) {
    await insert(client, 'product_collaborations', {
      product_id: id,
      title: p.collaboration.title,
      description: p.collaboration.description,
      image_url: p.collaboration.image,
      image_alt: p.collaboration.imageAlt,
    });
  }

  for (const [n, g] of p.specificationGroups.entries()) {
    const groupId = await insert(
      client,
      'product_specification_groups',
      { product_id: id, title: g.title, position: g.position ?? n },
      true
    );
    for (const [j, i] of g.items.entries()) {
      await insert(client, 'product_specification_items', {
        group_id: groupId,
        label: i.label,
        value: i.value,
        position: i.position ?? j,
      });
    }
  }

  for (const [n, b] of p.boxItems.entries()) {
    await insert(client, 'product_box_items', {
      product_id: id,
      name: b.name,
      image_url: b.image,
      image_alt: b.imageAlt,
      position: b.position ?? n,
    });
  }
}

export async function createProduct(p) {
  const id = await withTransaction(async (client) => {
    const newId = await insert(client, 'products', productColumns(p), true);
    await insertChildren(client, newId, p);
    return newId;
  });
  return getDetail(id);
}

export async function replaceProduct(id, p) {
  const found = await withTransaction(async (client) => {
    const r = await client.query(
      `UPDATE products
       SET name=$2, subtitle=$3, brand=$4, price=$5, currency=$6, description=$7, image_url=$8, updated_at=now()
       WHERE id=$1`,
      [id, p.name, p.subtitle, p.brand, p.price, p.currency, p.description, p.image]
    );
    if (!r.rowCount) return null;

    for (const table of CHILD_TABLES) {
      await client.query(`DELETE FROM ${table} WHERE product_id=$1`, [id]);
    }
    await insertChildren(client, id, p);
    return true;
  });
  return found ? getDetail(id) : null;
}

export async function deleteProduct(id) {
  const r = await pool.query('DELETE FROM products WHERE id=$1', [id]);
  return r.rowCount > 0;
}