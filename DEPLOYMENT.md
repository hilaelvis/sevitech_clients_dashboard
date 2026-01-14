# Deployment Guide - Sevitech Client Dashboard

## 📦 Pre-Deployment Checklist

Before deploying to production, ensure you've completed:

- [ ] Changed default admin password
- [ ] Generated secure session secret (32+ characters)
- [ ] Tested all features locally
- [ ] Added real Airtable data
- [ ] Reviewed security settings
- [ ] Created production `.env` file
- [ ] Documented any customizations
- [ ] Set up SSL/HTTPS certificates
- [ ] Configured backups

---

## 🚀 Heroku Deployment

### Prerequisites
- Heroku account ([Sign up](https://signup.heroku.com/))
- Heroku CLI installed ([Download](https://devcenter.heroku.com/articles/heroku-cli))

### Steps

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app:**
   ```bash
   heroku create sevitech-dashboard
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your-long-random-secret-here
   heroku config:set AIRTABLE_API_KEY=your-airtable-api-key
   heroku config:set AIRTABLE_BASE_ID=your-airtable-base-id
   heroku config:set ADMIN_USERNAME=admin
   heroku config:set ADMIN_PASSWORD=your-secure-password
   ```

4. **Initialize Git (if not already):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Deploy to Heroku:**
   ```bash
   git push heroku main
   ```

6. **Open your app:**
   ```bash
   heroku open
   ```

### Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# View config
heroku config

# Scale dynos
heroku ps:scale web=1
```

---

## 🌐 Vercel Deployment

### Prerequisites
- Vercel account ([Sign up](https://vercel.com/signup))
- Vercel CLI (optional)

### Method 1: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Add environment variables:
     - `NODE_ENV` = production
     - `SESSION_SECRET` = your-secret
     - `AIRTABLE_API_KEY` = your-key
     - `AIRTABLE_BASE_ID` = your-base-id
     - `ADMIN_USERNAME` = admin
     - `ADMIN_PASSWORD` = your-password

### Method 2: GitHub Integration

1. **Push code to GitHub**

2. **Import to Vercel:**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Deploy

---

## 🖥️ DigitalOcean Deployment

### Prerequisites
- DigitalOcean account
- SSH access to your droplet

### Steps

1. **Create a Droplet:**
   - OS: Ubuntu 22.04 LTS
   - Plan: Basic ($6/month minimum)
   - Choose datacenter region

2. **SSH into your droplet:**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y build-essential
   ```

4. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone your repository:**
   ```bash
   git clone https://github.com/yourusername/sevitech-dashboard.git
   cd sevitech-dashboard
   ```

6. **Install dependencies:**
   ```bash
   npm install --production
   ```

7. **Create `.env` file:**
   ```bash
   nano .env
   ```

   Add your production environment variables:
   ```env
   NODE_ENV=production
   PORT=3000
   SESSION_SECRET=your-secret
   AIRTABLE_API_KEY=your-key
   AIRTABLE_BASE_ID=your-base-id
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-password
   ```

8. **Start with PM2:**
   ```bash
   pm2 start server.js --name sevitech-dashboard
   pm2 save
   pm2 startup
   ```

9. **Set up Nginx (optional but recommended):**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/sevitech
   ```

   Add configuration:
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
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/sevitech /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Set up SSL with Let's Encrypt:**
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

### Useful PM2 Commands

```bash
# View running processes
pm2 list

# View logs
pm2 logs sevitech-dashboard

# Restart app
pm2 restart sevitech-dashboard

# Stop app
pm2 stop sevitech-dashboard

# Monitor
pm2 monit
```

---

## 📊 Environment Variables

### Required Variables

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-very-long-random-secret-32-chars-minimum
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-airtable-base-id
```

### Optional Variables

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
SESSION_TIMEOUT=1800000  # 30 minutes in milliseconds
```

### Generating Secure Secrets

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔒 Production Security

### Essential Security Measures

1. **Use HTTPS:**
   - Get SSL certificate (Let's Encrypt is free)
   - Redirect HTTP to HTTPS
   - Set `secure` cookie flag in production

2. **Secure Environment Variables:**
   - Never commit `.env` to Git
   - Use platform-specific secret management
   - Rotate secrets regularly

3. **Firewall Configuration:**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

4. **Keep Dependencies Updated:**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

5. **Set Up Monitoring:**
   - Enable error logging
   - Set up uptime monitoring
   - Monitor server resources

6. **Database Backups:**
   - Regular Airtable backups
   - Export data weekly
   - Store backups securely

### Server Hardening

```bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade

# Install fail2ban (prevents brute force)
sudo apt-get install fail2ban

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

---

## 🔍 Monitoring & Logging

### Set Up Logging

1. **PM2 Logs:**
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

2. **Application Logs:**
   - Logs are already configured with Morgan
   - Check logs: `pm2 logs sevitech-dashboard`

### Monitoring Tools

**Free Options:**
- **UptimeRobot** - Website uptime monitoring
- **PM2 Plus** - Application monitoring
- **New Relic** - Performance monitoring (free tier)

**Server Monitoring:**
```bash
# Install htop
sudo apt-get install htop

# Monitor in real-time
htop
```

---

## 🐛 Debugging Production Issues

### Common Issues

**App won't start:**
```bash
# Check logs
pm2 logs

# Check if port is in use
sudo lsof -i :3000

# Restart app
pm2 restart all
```

**Can't connect to Airtable:**
- Verify environment variables: `pm2 env 0`
- Check API key permissions
- Test connection from server

**Session issues:**
- Verify SESSION_SECRET is set
- Check cookie settings for HTTPS
- Clear browser cookies

**Performance issues:**
```bash
# Check server resources
htop

# Check Node.js process
pm2 monit

# Scale if needed
pm2 scale sevitech-dashboard +2
```

---

## 📈 Scaling

### Vertical Scaling (Increase Server Size)

**Heroku:**
```bash
heroku ps:resize web=standard-2x
```

**DigitalOcean:**
- Resize droplet in dashboard
- No downtime with resize

### Horizontal Scaling (Multiple Instances)

**PM2 Cluster Mode:**
```bash
pm2 start server.js -i max --name sevitech-dashboard
```

**Load Balancer:**
- Use Nginx as load balancer
- Or use cloud provider's load balancer

---

## 🔄 Updates & Maintenance

### Deploying Updates

**Heroku:**
```bash
git add .
git commit -m "Update message"
git push heroku main
```

**DigitalOcean with PM2:**
```bash
cd /path/to/sevitech-dashboard
git pull origin main
npm install
pm2 restart sevitech-dashboard
```

### Zero-Downtime Deployment

```bash
pm2 reload sevitech-dashboard
```

---

## 💾 Backup Strategy

### Automated Backups

1. **Airtable Data:**
   - Use Airtable's built-in export
   - Schedule weekly CSV exports
   - Store in secure cloud storage

2. **Application Configuration:**
   ```bash
   # Backup .env file securely
   # Version control code (without .env)
   ```

3. **Server Backups (DigitalOcean):**
   - Enable automated snapshots
   - Schedule: Weekly
   - Retention: 4 weeks

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads correctly
- [ ] Can login with credentials
- [ ] Airtable connection works
- [ ] All pages load (Dashboard, Clients, Messages, Analytics, Settings)
- [ ] Can view client data
- [ ] Can update client status
- [ ] Charts render correctly
- [ ] Export features work (CSV, PDF)
- [ ] Dark mode toggles correctly
- [ ] Mobile responsiveness works
- [ ] HTTPS is enabled
- [ ] Sessions persist correctly
- [ ] Password change works
- [ ] No console errors
- [ ] Server logs are clean

---

## 🆘 Support Resources

### Documentation
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [DigitalOcean PM2 Tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt Guide](https://letsencrypt.org/getting-started/)

### Monitoring Services
- [UptimeRobot](https://uptimerobot.com/)
- [PM2 Plus](https://pm2.io/)
- [New Relic](https://newrelic.com/)
- [Datadog](https://www.datadoghq.com/)

---

## 📝 Notes

- Always test updates in a staging environment first
- Keep detailed deployment logs
- Document any custom configurations
- Maintain emergency rollback procedures
- Have a disaster recovery plan

---

**Your Sevitech Dashboard is now production-ready! 🚀**

For issues or questions, refer to the main README.md or contact support.
