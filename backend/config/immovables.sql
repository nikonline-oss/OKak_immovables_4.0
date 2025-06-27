CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE card_type AS ENUM ('developer', 'complex', 'apartment');
CREATE TYPE purchase_status AS ENUM ('pending', 'reserved', 'completed', 'canceled');
CREATE TYPE property_status AS ENUM ('draft', 'available', 'reserved', 'sold');

-- Пользователи системы
CREATE TABLE "user"(
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "avatar_url" VARCHAR(255),
    "isVerified" BOOLEAN DEFAULT FALSE,
    "role" user_role NOT NULL DEFAULT 'buyer',
);

-- Профили застройщиков
CREATE TABLE "developer_profile"(
    "user_id" INT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    "company_name" VARCHAR(255) NOT NULL,
    "inn" VARCHAR(20) NOT NULL UNIQUE,
    "description" TEXT,
    "logo_url" VARCHAR(255),
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(20),
    "rating" SMALLINT NOT NULL DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Жилые комплексы
CREATE TABLE "residential_complex"(
    "id" SERIAL PRIMARY KEY,
    "developer_id" INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "address" VARCHAR(500) NOT NULL,
    "latitude" DECIMAL(10, 8) NOT NULL,
    "longitude" DECIMAL(11, 8) NOT NULL,
    "completion_date" DATE NOT NULL,
    "status" property_status NOT NULL DEFAULT 'available',
);

-- Карточки квартир
CREATE TABLE "apartment"(
    "id" SERIAL PRIMARY KEY,
    "complex_id" INT NOT NULL REFERENCES "residential_complex"(id) ON DELETE CASCADE,
    "seller_id" INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "area" DECIMAL(6,2) NOT NULL,
    "room_count" SMALLINT NOT NULL,
    "floor" SMALLINT NOT NULL,
    "total_floors" SMALLINT NOT NULL,
    "price" NUMERIC(12,2) NOT NULL,
    "status" property_status NOT NULL DEFAULT 'available',
);

-- Динамическое ценообразование
CREATE TABLE "price_history"(
    "id" SERIAL PRIMARY KEY,
    "apartment_id" INT NOT NULL REFERENCES "apartment"(id) ON DELETE CASCADE,
    "old_price" NUMERIC(12,2) NOT NULL,
    "new_price" NUMERIC(12,2) NOT NULL,
    "reason" VARCHAR(255) NOT NULL
);

-- Процесс покупки
CREATE TABLE "purchase"(
    "id" SERIAL PRIMARY KEY,
    "apartment_id" INT NOT NULL REFERENCES "apartment"(id) ON DELETE CASCADE,
    "buyer_id" INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "status" purchase_status NOT NULL DEFAULT 'pending',
    "price" NUMERIC(12,2) NOT NULL,
    "reserved_until" TIMESTAMP, -- Срок резерва (например 48 часов)
    "contract_url" VARCHAR(255),
    "payment_proof_url" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP
);

-- Медиа-контент для объектов
CREATE TABLE "property_media"(
    "id" SERIAL PRIMARY KEY,
    "apartment_id" INT REFERENCES "apartment"(id) ON DELETE CASCADE,
    "complex_id" INT REFERENCES "residential_complex"(id) ON DELETE CASCADE,
    "url" VARCHAR(255) NOT NULL,
    "media_type" VARCHAR(50) NOT NULL CHECK ("media_type" IN('image', '3d_tour', 'video', 'plan', 'document')),
    "is_primary" BOOLEAN NOT NULL DEFAULT FALSE,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Избранное (для покупателей)
CREATE TABLE "favorite"(
    "user_id" INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "apartment_id" INT NOT NULL REFERENCES "apartment"(id) ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id", "apartment_id")
);

-- Индексы для ускорения поиска
CREATE INDEX idx_complex_developer ON residential_complex(developer_id);
CREATE INDEX idx_apartment_complex ON apartment(complex_id);
CREATE INDEX idx_apartment_price ON apartment(price);
CREATE INDEX idx_apartment_status ON apartment(status);
CREATE INDEX idx_purchase_status ON purchase(status);
CREATE INDEX idx_media_apartment ON property_media(apartment_id);

-- Триггер для динамического ценообразования
CREATE OR REPLACE FUNCTION update_apartment_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price <> OLD.price THEN
        INSERT INTO price_history (apartment_id, old_price, new_price, reason)
        VALUES (NEW.id, OLD.price, NEW.price, 'Автоматическое обновление');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER apartment_price_update
AFTER UPDATE OF price ON apartment
FOR EACH ROW
EXECUTE FUNCTION update_apartment_price();