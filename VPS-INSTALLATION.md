# BeejHealth - VPS Installation Guide

## Step 1: Connect to VPS
```bash
ssh root@your-server-ip
```

## Step 2: Update System
```bash
apt update && apt upgrade -y
```

## Step 3: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
```

## Step 4: Install Python & Pip
```bash
apt install -y python3 python3-pip
```

## Step 5: Install PM2 (Process Manager)
```bash
npm install -g pm2
```

## Step 6: Clone Project
```bash
cd /var/www
git clone https://github.com/Deepcodeview/agri.git
cd agri
```

## Step 7: Install Dependencies
```bash
npm install
pip3 install -r requirements.txt
```

## Step 8: Upload Model File
```bash
# Upload your .pth file to /var/www/agri/
scp Resnet50-from-scratch-with-New-Plant-Disease.pth root@your-server-ip:/var/www/agri/
```

## Step 9: Environment Setup
```bash
cp .env.example .env
nano .env
```
Update with production values

## Step 10: Build Project
```bash
npm run build
```

## Step 11: Start with PM2
```bash
pm2 start npm --name "beejhealth" -- start
pm2 save
pm2 startup
```

## Step 12: Install Nginx
```bash
apt install -y nginx
```

## Step 13: Configure Nginx
```bash
nano /etc/nginx/sites-available/beejhealth
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
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
```

## Step 14: Enable Site
```bash
ln -s /etc/nginx/sites-available/beejhealth /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Step 15: Install SSL (Optional)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

## Step 16: Setup Firewall
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

## Useful Commands

**Check PM2 status:**
```bash
pm2 status
pm2 logs beejhealth
```

**Restart application:**
```bash
pm2 restart beejhealth
```

**Update code:**
```bash
cd /var/www/agri
git pull
npm run build
pm2 restart beejhealth
```

**Check Nginx:**
```bash
systemctl status nginx
nginx -t
```

## Troubleshooting

**Port 3000 already in use:**
```bash
pm2 kill
pm2 start npm --name "beejhealth" -- start
```

**Python module not found:**
```bash
pip3 install --upgrade pip
pip3 install -r requirements.txt
```

**Nginx error:**
```bash
systemctl restart nginx
tail -f /var/log/nginx/error.log
```