-- Database setup script for Sponsored Analytic System
-- Run this script in MySQL to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS sponsored_analytics;
USE sponsored_analytics;

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  status ENUM('active','paused') DEFAULT 'active',
  budget DECIMAL(10,2) NOT NULL,
  spent DECIMAL(10,2) NOT NULL,
  revenue DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create influencers table
CREATE TABLE IF NOT EXISTS influencers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  platform VARCHAR(100) NOT NULL,
  followers INT NOT NULL,
  engagement_rate DECIMAL(5,2) NOT NULL,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO campaigns (name, brand, status, budget, spent, revenue) VALUES
('Summer Boost 2024', 'Nike', 'active', 50000.00, 32000.00, 78000.00),
('Tech Launch Q3', 'Samsung', 'active', 75000.00, 48000.00, 112000.00),
('Fitness Challenge', 'Adidas', 'completed', 30000.00, 28500.00, 65000.00),
('Beauty Essentials', 'L\'Oreal', 'paused', 40000.00, 15000.00, 22000.00);