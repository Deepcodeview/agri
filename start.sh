#!/bin/bash

# Install Node.js if not installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Navigate to project directory
cd /var/www/html/agri

# Install dependencies
npm install --production

# Start application with PM2
pm2 start npm --name "agri-app" -- start

# Setup PM2 to start on boot
pm2 startup
pm2 save

# Configure Nginx proxy
cat > /etc/nginx/sites-available/agri << 'EOF'
server {
    listen 80;
    server_name _;
    
    location /agri {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site and restart nginx
ln -sf /etc/nginx/sites-available/agri /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "Application deployed successfully!"
echo "Access at: http://161.248.163.76/agri"