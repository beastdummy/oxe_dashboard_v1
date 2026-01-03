-- =====================================================
-- OXE Dashboard v1 - Database Schema
-- =====================================================
-- Execute this file in your MySQL database to create
-- all necessary tables for the OXE Dashboard
-- =====================================================

-- =====================================================
-- ADMIN LOGS TABLE
-- =====================================================
-- Stores all admin actions for auditing and accountability

CREATE TABLE IF NOT EXISTS `admin_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `admin_name` VARCHAR(50) NOT NULL,
    `action` VARCHAR(50) NOT NULL COMMENT 'message, suspend, ban, spectate, broadcast, heal, kill, freeze, inventory',
    `target_id` VARCHAR(50),
    `target_name` VARCHAR(50),
    `details` JSON COMMENT 'Additional action details stored as JSON',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for fast queries
    KEY `idx_admin_id` (`admin_id`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_action` (`action`),
    KEY `idx_target_id` (`target_id`),
    
    -- Composite index for common queries
    KEY `idx_admin_action` (`admin_id`, `action`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PLAYER BANS TABLE
-- =====================================================
-- Stores information about player bans

CREATE TABLE IF NOT EXISTS `player_bans` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `player_id` VARCHAR(50) NOT NULL,
    `player_name` VARCHAR(50) NOT NULL,
    `admin_id` INT NOT NULL,
    `admin_name` VARCHAR(50) NOT NULL,
    `reason` TEXT,
    `ban_type` ENUM('permanent', 'temporary') DEFAULT 'temporary',
    `ban_until` DATETIME COMMENT 'NULL for permanent bans',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    
    -- Indexes
    KEY `idx_player_id` (`player_id`),
    KEY `idx_admin_id` (`admin_id`),
    KEY `idx_ban_until` (`ban_until`),
    KEY `idx_is_active` (`is_active`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PLAYER SUSPENSIONS TABLE
-- =====================================================
-- Stores information about temporary player suspensions

CREATE TABLE IF NOT EXISTS `player_suspensions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `player_id` VARCHAR(50) NOT NULL,
    `player_name` VARCHAR(50) NOT NULL,
    `admin_id` INT NOT NULL,
    `admin_name` VARCHAR(50) NOT NULL,
    `reason` TEXT,
    `duration_days` INT NOT NULL,
    `suspend_until` DATETIME NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    
    -- Indexes
    KEY `idx_player_id` (`player_id`),
    KEY `idx_admin_id` (`admin_id`),
    KEY `idx_suspend_until` (`suspend_until`),
    KEY `idx_is_active` (`is_active`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ADMIN MESSAGES TABLE
-- =====================================================
-- Stores messages sent to players by admins

CREATE TABLE IF NOT EXISTS `admin_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `admin_name` VARCHAR(50) NOT NULL,
    `player_id` VARCHAR(50) NOT NULL,
    `player_name` VARCHAR(50) NOT NULL,
    `message_type` ENUM('chat', 'notification') DEFAULT 'notification',
    `title` VARCHAR(100),
    `message` TEXT NOT NULL,
    `read_at` DATETIME,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    KEY `idx_player_id` (`player_id`),
    KEY `idx_admin_id` (`admin_id`),
    KEY `idx_message_type` (`message_type`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ADMIN BROADCASTS TABLE
-- =====================================================
-- Stores server-wide announcements sent by admins

CREATE TABLE IF NOT EXISTS `admin_broadcasts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `admin_name` VARCHAR(50) NOT NULL,
    `message` TEXT NOT NULL,
    `broadcast_type` ENUM('success', 'info', 'warn', 'error') DEFAULT 'info',
    `player_count` INT COMMENT 'Number of players who received it',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    KEY `idx_admin_id` (`admin_id`),
    KEY `idx_broadcast_type` (`broadcast_type`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ADMIN SPECTATE LOG TABLE
-- =====================================================
-- Tracks when admins spectate players

CREATE TABLE IF NOT EXISTS `admin_spectate_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `admin_name` VARCHAR(50) NOT NULL,
    `target_id` VARCHAR(50) NOT NULL,
    `target_name` VARCHAR(50) NOT NULL,
    `spectate_start` DATETIME NOT NULL,
    `spectate_end` DATETIME,
    `duration_seconds` INT COMMENT 'Calculated when spectate ends',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    KEY `idx_admin_id` (`admin_id`),
    KEY `idx_target_id` (`target_id`),
    KEY `idx_spectate_start` (`spectate_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ADMIN PUNISHMENTS SUMMARY TABLE
-- =====================================================
-- Quick summary of player punishments for reports

CREATE TABLE IF NOT EXISTS `player_punishment_summary` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `player_id` VARCHAR(50) NOT NULL UNIQUE,
    `player_name` VARCHAR(50) NOT NULL,
    `total_bans` INT DEFAULT 0,
    `total_suspensions` INT DEFAULT 0,
    `total_warnings` INT DEFAULT 0,
    `last_punishment_type` VARCHAR(50),
    `last_punishment_date` DATETIME,
    `last_admin` VARCHAR(50),
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    KEY `idx_player_id` (`player_id`),
    KEY `idx_last_punishment_date` (`last_punishment_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ADMIN ACTIVITY TABLE
-- =====================================================
-- Tracks general admin activity and login/logout

CREATE TABLE IF NOT EXISTS `admin_activity` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `admin_name` VARCHAR(50) NOT NULL,
    `activity_type` ENUM('login', 'logout', 'action', 'spectate', 'kick') DEFAULT 'action',
    `description` TEXT,
    `ip_address` VARCHAR(45) COMMENT 'IPv4 or IPv6',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    KEY `idx_admin_id` (`admin_id`),
    KEY `idx_activity_type` (`activity_type`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DATABASE VIEWS (for easier querying)
-- =====================================================

-- View for active bans only
CREATE OR REPLACE VIEW `v_active_bans` AS
SELECT 
    pb.*,
    CASE 
        WHEN pb.ban_type = 'permanent' THEN 'Permanente'
        WHEN pb.ban_until > NOW() THEN CONCAT('Hasta ', DATE_FORMAT(pb.ban_until, '%d/%m/%Y %H:%i'))
        ELSE 'Expirado'
    END as ban_status,
    DATEDIFF(pb.ban_until, NOW()) as days_remaining
FROM player_bans pb
WHERE pb.is_active = TRUE
ORDER BY pb.created_at DESC;

-- View for active suspensions only
CREATE OR REPLACE VIEW `v_active_suspensions` AS
SELECT 
    ps.*,
    DATEDIFF(ps.suspend_until, NOW()) as days_remaining,
    CASE 
        WHEN ps.suspend_until > NOW() THEN 'Activa'
        ELSE 'Expirada'
    END as suspension_status
FROM player_suspensions ps
WHERE ps.is_active = TRUE
ORDER BY ps.suspend_until DESC;

-- View for recent admin actions
CREATE OR REPLACE VIEW `v_recent_actions` AS
SELECT 
    al.*,
    TIME_FORMAT(TIMEDIFF(NOW(), al.created_at), '%H:%i:%s') as time_ago
FROM admin_logs al
ORDER BY al.created_at DESC
LIMIT 100;

-- View for admin performance metrics
CREATE OR REPLACE VIEW `v_admin_metrics` AS
SELECT 
    al.admin_id,
    al.admin_name,
    COUNT(*) as total_actions,
    COUNT(DISTINCT al.action) as unique_actions,
    COUNT(CASE WHEN al.action = 'message' THEN 1 END) as messages_sent,
    COUNT(CASE WHEN al.action = 'ban' THEN 1 END) as bans,
    COUNT(CASE WHEN al.action = 'suspend' THEN 1 END) as suspensions,
    COUNT(CASE WHEN al.action = 'spectate' THEN 1 END) as spectates,
    MAX(al.created_at) as last_action
FROM admin_logs al
GROUP BY al.admin_id, al.admin_name
ORDER BY total_actions DESC;

-- =====================================================
-- STORED PROCEDURES (optional, for complex queries)
-- =====================================================

-- Get player punishment history
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS `get_player_punishment_history`(
    IN p_player_id VARCHAR(50),
    IN p_limit INT DEFAULT 20
)
BEGIN
    SELECT 
        'ban' as punishment_type,
        pb.admin_name,
        pb.reason,
        pb.ban_type,
        pb.created_at,
        CASE WHEN pb.is_active THEN 'Activo' ELSE 'Inactivo' END as status
    FROM player_bans pb
    WHERE pb.player_id = p_player_id
    
    UNION ALL
    
    SELECT 
        'suspension' as punishment_type,
        ps.admin_name,
        ps.reason,
        'temporary' as ban_type,
        ps.created_at,
        CASE WHEN ps.is_active THEN 'Activa' ELSE 'Expirada' END as status
    FROM player_suspensions ps
    WHERE ps.player_id = p_player_id
    
    ORDER BY created_at DESC
    LIMIT p_limit;
END$$
DELIMITER ;

-- Clean up expired suspensions and bans
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS `cleanup_expired_punishments`()
BEGIN
    UPDATE player_bans 
    SET is_active = FALSE 
    WHERE ban_type = 'temporary' AND ban_until < NOW() AND is_active = TRUE;
    
    UPDATE player_suspensions 
    SET is_active = FALSE 
    WHERE suspend_until < NOW() AND is_active = TRUE;
END$$
DELIMITER ;

-- =====================================================
-- SUPPORT TICKETS TABLE
-- =====================================================
-- Stores player support tickets/reports

CREATE TABLE IF NOT EXISTS `support_tickets` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `player_id` VARCHAR(50) NOT NULL,
    `player_name` VARCHAR(50) NOT NULL,
    `player_band` VARCHAR(100),
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `priority` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    `status` ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `resolved_at` DATETIME,
    `resolved_by_admin_id` INT,
    `resolved_by_admin_name` VARCHAR(50),
    
    -- Indexes
    KEY `idx_player_id` (`player_id`),
    KEY `idx_status` (`status`),
    KEY `idx_priority` (`priority`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_resolved_at` (`resolved_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TICKET MESSAGES TABLE
-- =====================================================
-- Stores messages within a ticket

CREATE TABLE IF NOT EXISTS `ticket_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` VARCHAR(50) NOT NULL,
    `author_id` VARCHAR(50),
    `author_name` VARCHAR(50) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `message_type` ENUM('text', 'image', 'system') DEFAULT 'text',
    `image_url` VARCHAR(500),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    KEY `idx_ticket_id` (`ticket_id`),
    KEY `idx_author_id` (`author_id`),
    KEY `idx_created_at` (`created_at`),
    
    -- Foreign key
    CONSTRAINT `fk_ticket_messages` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TICKET PARTICIPANTS TABLE
-- =====================================================
-- Tracks which admins have been invited to a ticket

CREATE TABLE IF NOT EXISTS `ticket_participants` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` VARCHAR(50) NOT NULL,
    `player_id` VARCHAR(50),
    `player_name` VARCHAR(50),
    `invited_by_admin_id` INT,
    `invited_by_admin_name` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    KEY `idx_ticket_id` (`ticket_id`),
    KEY `idx_player_id` (`player_id`),
    
    -- Foreign key
    CONSTRAINT `fk_ticket_participants` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INITIAL DATA (optional)
-- =====================================================

-- You can add initial data here if needed, for example:
-- INSERT INTO admin_logs (admin_id, admin_name, action, target_id, target_name, details, created_at)
-- VALUES (1, 'ServerAdmin', 'database_setup', NULL, NULL, '{"message": "Database tables created"}', NOW());

-- =====================================================
-- FINAL NOTES
-- =====================================================
-- 1. All timestamps are in UTC (CURRENT_TIMESTAMP)
-- 2. All text fields use utf8mb4 for full Unicode support
-- 3. Indexes are optimized for common queries
-- 4. JSON columns allow flexible storage of action details
-- 5. Views provide easy access to common data sets
-- 6. Procedures help with complex operations

-- After running this script, verify all tables were created:
-- SHOW TABLES;
-- DESCRIBE admin_logs;
-- DESCRIBE player_bans;
-- DESCRIBE player_suspensions;
-- etc.
