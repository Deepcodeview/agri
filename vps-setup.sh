#!/bin/bash

echo "=== VPS Setup Starting ==="

# Update system
apt update -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install nginx -y

# Create project directory
mkdir -p /var/www/html/agri
cd /var/www/html/agri

# Extract uploaded files
unzip /tmp/agri-deploy.zip

# Install dependencies
npm install --production

# Start application
pm2 start npm --name "agri-app" -- start
pm2 startup
pm2 save

# Configure Nginx
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    server_name _;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /agri/ {
        proxy_pass http://localhost:3000/;
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

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Open firewall ports
ufw allow 80
ufw allow 3000

# Show status
echo "=== Setup Complete ==="
echo "PM2 Status:"
pm2 list
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager
echo ""
echo "Application URL: http://161.248.163.76/agri"
echo "Direct Port URL: http://161.248.163.76:3000"