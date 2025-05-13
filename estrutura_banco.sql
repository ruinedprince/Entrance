CREATE DATABASE IF NOT EXISTS entrance;
USE entrance;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    cpf VARCHAR(14) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    address VARCHAR(255),
    cep VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    birth_date DATE,
    role VARCHAR(50)
);

-- WALLET (general for user)
CREATE TABLE IF NOT EXISTS wallet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    total DECIMAL(12,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- EVENT_WALLET (specific for event)
CREATE TABLE IF NOT EXISTS event_wallet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id CHAR(36),
    user_id CHAR(36),
    total DECIMAL(12,2) DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- WITHDRAWAL_REQUEST
CREATE TABLE IF NOT EXISTS withdrawal_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT,
    event_wallet_id INT,
    user_id CHAR(36),
    amount DECIMAL(12,2) NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    approved_by CHAR(36),
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    FOREIGN KEY (wallet_id) REFERENCES wallet(id) ON DELETE CASCADE,
    FOREIGN KEY (event_wallet_id) REFERENCES event_wallet(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- ARTISTS
CREATE TABLE IF NOT EXISTS artists (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    instagram VARCHAR(255),
    soundcloud VARCHAR(255),
    spotify VARCHAR(255),
    owner_user_id CHAR(36),
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

-- EVENTS
CREATE TABLE IF NOT EXISTS events (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    edition VARCHAR(50),
    description TEXT,
    cover_image VARCHAR(255),
    start_date DATE,
    start_time TIME,
    end_date DATE,
    end_time TIME,
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    meta_pixel VARCHAR(255)
);

-- PRODUCER_EVENT
CREATE TABLE IF NOT EXISTS producer_event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id CHAR(36),
    user_id CHAR(36),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- FAVORITE_EVENT
CREATE TABLE IF NOT EXISTS favorite_event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    event_id CHAR(36),
    UNIQUE(user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- FAVORITE_ARTIST
CREATE TABLE IF NOT EXISTS favorite_artist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    artist_id CHAR(36),
    UNIQUE(user_id, artist_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- ARTIST_NOTIFICATION
CREATE TABLE IF NOT EXISTS artist_notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id CHAR(36),
    user_id CHAR(36),
    event_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- EVENT_ARTIST
CREATE TABLE IF NOT EXISTS event_artist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id CHAR(36),
    artist_id CHAR(36),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- TICKET_TYPE
CREATE TABLE IF NOT EXISTS ticket_type (
    id CHAR(36) PRIMARY KEY,
    event_id CHAR(36),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_product BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- TICKETS
CREATE TABLE IF NOT EXISTS tickets (
    id CHAR(36) PRIMARY KEY,
    ticket_type_id CHAR(36),
    event_id CHAR(36),
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(30) NOT NULL,
    assigned_user_id CHAR(36),
    purchase_price DECIMAL(10,2),
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_type(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id)
);

-- PURCHASE
CREATE TABLE IF NOT EXISTS purchase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    ticket_id CHAR(36),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- RESALE
CREATE TABLE IF NOT EXISTS resale (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id CHAR(36),
    seller_id CHAR(36),
    buyer_id CHAR(36),
    resale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resale_link VARCHAR(255),
    resale_price DECIMAL(10,2),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- WITHDRAWAL_QUEUE
CREATE TABLE IF NOT EXISTS withdrawal_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id CHAR(36),
    ticket_id CHAR(36),
    user_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- GALLERY
CREATE TABLE IF NOT EXISTS gallery (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    name VARCHAR(255),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- GALLERY_PHOTO
CREATE TABLE IF NOT EXISTS gallery_photo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gallery_id CHAR(36),
    url VARCHAR(255),
    FOREIGN KEY (gallery_id) REFERENCES gallery(id) ON DELETE CASCADE
);

-- EVENT_GALLERY_PHOTO
CREATE TABLE IF NOT EXISTS event_gallery_photo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id CHAR(36),
    url VARCHAR(255),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- TAG
CREATE TABLE IF NOT EXISTS tag (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_predefined BOOLEAN DEFAULT TRUE,
    requested_by CHAR(36),
    approved_by CHAR(36),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- EVENT_TAG
CREATE TABLE IF NOT EXISTS event_tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id CHAR(36),
    tag_id CHAR(36),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);

-- VALIDATOR
CREATE TABLE IF NOT EXISTS validator (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    event_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- VALIDATOR_TICKET_TYPE
CREATE TABLE IF NOT EXISTS validator_ticket_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    validator_id INT,
    ticket_type_id CHAR(36),
    FOREIGN KEY (validator_id) REFERENCES validator(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_type(id) ON DELETE CASCADE
);
