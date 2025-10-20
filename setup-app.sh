#!/bin/bash

echo "🔧 Setting up BeejHealth Application..."

cd /var/www/beejhealth

# Install Node dependencies
npm install

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install pillow numpy

# Create environment file
cat > .env.local << EOF
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://agri.cvframeiq.com
DATABASE_URL=mysql://beejhealth_user:Deepak9955@@localhost:3306/beejhealth
WHATSAPP_API_KEY=your_api_key
WHATSAPP_PHONE_ID=your_phone_id
EOF

# Build application
npm run build

# Create PM2 config
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'beejhealth',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/beejhealth',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Setup Nginx
cat > /etc/nginx/sites-available/beejhealth << EOF
server {
    listen 80;
    server_name agri.cvframeiq.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/beejhealth /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Set permissions
chown -R www-data:www-data /var/www/beejhealth
chmod -R 755 /var/www/beejhealth
mkdir -p /var/www/beejhealth/temp
chmod 777 /var/www/beejhealth/temp

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Install SSL
apt install certbot python3-certbot-nginx -y
certbot --nginx -d agri.cvframeiq.com --non-interactive --agree-tos --email admin@cvframeiq.com

echo "🎉 Deployment Complete!"
echo "🌐 Your app is live at: https://agri.cvframeiq.com"