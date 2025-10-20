#!/bin/bash

echo "🚀 Starting BeejHealth Deployment..."

# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Python & dependencies
apt install python3 python3-pip python3-venv nginx mysql-server -y

# Install PM2
npm install -g pm2

# Create project directory
mkdir -p /var/www/beejhealth
cd /var/www/beejhealth

# MySQL setup
mysql -e "CREATE DATABASE IF NOT EXISTS beejhealth;"
mysql -e "CREATE USER IF NOT EXISTS 'beejhealth_user'@'localhost' IDENTIFIED BY 'Deepak9955@';"
mysql -e "GRANT ALL PRIVILEGES ON beejhealth.* TO 'beejhealth_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Clone project from GitHub
echo "📥 Cloning BeejHealth from GitHub..."
git clone https://github.com/YOUR_USERNAME/beejhealth-server.git /var/www/beejhealth
cd /var/www/beejhealth

# Install Git if not present
apt install git -y

echo "✅ System setup complete!"
echo "🔧 Running application setup..."
bash setup-app.sh