CREATE TABLE IF NOT EXISTS products (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 name TEXT NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 160),
 subtitle TEXT NOT NULL CHECK (length(btrim(subtitle)) BETWEEN 1 AND 240),
 brand TEXT NOT NULL CHECK (length(btrim(brand)) BETWEEN 1 AND 120),
 price BIGINT NOT NULL CHECK (price >= 0), currency CHAR(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
 description TEXT NOT NULL CHECK (length(btrim(description)) BETWEEN 1 AND 5000),
 image_url TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS product_variants (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
 variant_type TEXT NOT NULL CHECK (variant_type IN ('color','size')), value TEXT NOT NULL CHECK (length(btrim(value)) BETWEEN 1 AND 100),
 quantity INTEGER NOT NULL CHECK (quantity >= 0), position INTEGER NOT NULL CHECK (position >= 0),
 UNIQUE(product_id, variant_type, value)
);
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_value_ci ON product_variants(product_id, variant_type, lower(value));
CREATE TABLE IF NOT EXISTS variant_images (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
 role TEXT NOT NULL CHECK (length(btrim(role)) BETWEEN 1 AND 40), image_url TEXT NOT NULL, alt_text TEXT NOT NULL CHECK (length(btrim(alt_text)) BETWEEN 1 AND 240), position INTEGER NOT NULL CHECK (position >= 0),
 UNIQUE(variant_id, role)
);
CREATE TABLE IF NOT EXISTS product_highlights (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT NOT NULL, icon TEXT NOT NULL, position INTEGER NOT NULL CHECK(position >= 0));
CREATE TABLE IF NOT EXISTS product_services (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT NOT NULL, position INTEGER NOT NULL CHECK(position >= 0));
CREATE TABLE IF NOT EXISTS product_collaborations (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, product_id BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT NOT NULL, image_url TEXT NOT NULL, image_alt TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS product_specification_groups (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE, title TEXT NOT NULL, position INTEGER NOT NULL CHECK(position >= 0));
CREATE TABLE IF NOT EXISTS product_specification_items (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, group_id BIGINT NOT NULL REFERENCES product_specification_groups(id) ON DELETE CASCADE, label TEXT NOT NULL, value TEXT NOT NULL, position INTEGER NOT NULL CHECK(position >= 0));
CREATE TABLE IF NOT EXISTS product_box_items (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE, name TEXT NOT NULL, image_url TEXT NOT NULL, image_alt TEXT NOT NULL, position INTEGER NOT NULL CHECK(position >= 0));
