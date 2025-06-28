-- Пользователи
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
  verified BOOLEAN DEFAULT false
);

-- Профили пользователей
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(255)
);

-- OAuth-привязки
CREATE TABLE oauth_connections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google', 'yandex', 'bitrix'
  provider_id VARCHAR(255) NOT NULL,
  access_token VARCHAR(500),
  refresh_token VARCHAR(500),
  expires_at TIMESTAMP,
  UNIQUE(user_id, provider)
);


-- Объекты недвижимости
CREATE TABLE apartments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  rooms INTEGER,
  area NUMERIC(6,2),
  address JSONB,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  developer_id INTEGER REFERENCES users(id)
);

-- Бронирования
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  apartment_id INTEGER REFERENCES apartments(id),
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Интеграция с Bitrix24
CREATE TABLE bitrix_integrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  access_token VARCHAR(500) NOT NULL,
  refresh_token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL
);