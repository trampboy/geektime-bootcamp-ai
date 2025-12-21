# Project Alpha - 部署指南

本文档提供 Project Alpha 在生产环境的部署指南。

---

## 📋 部署清单

### 服务器要求

#### 最低配置
- CPU: 2核
- 内存: 4GB RAM
- 存储: 20GB SSD
- 操作系统: Ubuntu 20.04 LTS 或更高

#### 推荐配置
- CPU: 4核
- 内存: 8GB RAM
- 存储: 40GB SSD
- 操作系统: Ubuntu 22.04 LTS

### 软件要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- Nginx >= 1.18
- PM2（进程管理）

---

## 🚀 部署方案

### 方案一：传统服务器部署（推荐）

适合中小型项目，成本低，易于维护。

#### 架构图

```
Internet
   ↓
Nginx (反向代理 + 静态文件)
   ↓
Express.js (后端 API)
   ↓
MySQL (数据库)
```

---

## 📝 部署步骤

### Step 1: 服务器准备

#### 1.1 更新系统

```bash
sudo apt update && sudo apt upgrade -y
```

#### 1.2 安装 Node.js

```bash
# 使用 nvm 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 验证安装
node -v  # 应输出 v18.x.x
npm -v
```

#### 1.3 安装 MySQL

```bash
# 安装 MySQL 8.0
sudo apt install mysql-server -y

# 启动 MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
sudo mysql_secure_installation
```

#### 1.4 安装 Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 1.5 安装 PM2

```bash
npm install -g pm2
```

---

### Step 2: 数据库配置

#### 2.1 创建数据库用户

```bash
# 登录 MySQL
sudo mysql -u root -p

# 创建数据库和用户
CREATE DATABASE ticket_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ticket_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON ticket_manager.* TO 'ticket_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 2.2 导入数据库结构

```bash
mysql -u ticket_user -p ticket_manager < /path/to/database/init.sql

# （可选）导入测试数据
mysql -u ticket_user -p ticket_manager < /path/to/database/seed.sql
```

---

### Step 3: 部署后端

#### 3.1 上传代码

```bash
# 方式 1: Git Clone（推荐）
cd /var/www
sudo git clone <your-repo-url> project-alpha
cd project-alpha

# 方式 2: SCP 上传
# 在本地执行：
scp -r ./backend user@server:/var/www/project-alpha/
```

#### 3.2 配置环境变量

```bash
cd /var/www/project-alpha/backend
cp .env.example .env
nano .env
```

**生产环境 .env 配置：**

```env
# 数据库配置
DB_HOST=127.0.0.1
DB_USER=ticket_user
DB_PASSWORD=your_strong_password
DB_NAME=ticket_manager
DB_PORT=3306

# 服务器配置
PORT=3000
NODE_ENV=production

# 前端 URL（用于 CORS）
FRONTEND_URL=https://yourdomain.com

# 日志配置
LOG_LEVEL=info
```

#### 3.3 安装依赖并构建

```bash
cd /var/www/project-alpha/backend

# 安装依赖
npm install --production

# 构建 TypeScript
npm run build

# 测试构建结果
node dist/app.js
```

#### 3.4 使用 PM2 启动

```bash
# 创建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'project-alpha-api',
    script: './dist/app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs project-alpha-api

# 设置开机自启
pm2 startup
pm2 save
```

---

### Step 4: 部署前端

#### 4.1 构建前端

```bash
cd /var/www/project-alpha/frontend

# 安装依赖
npm install

# 配置生产环境 API 地址
cat > .env.production << 'EOF'
VITE_API_URL=https://api.yourdomain.com
EOF

# 构建
npm run build

# 构建产物在 dist/ 目录
```

#### 4.2 配置 Nginx

```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/project-alpha
```

**Nginx 配置内容：**

```nginx
# 后端 API 服务器
upstream backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP 重定向到 HTTPS（如果使用 SSL）
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# 主服务器配置
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 证书配置（使用 Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 前端静态文件
    root /var/www/project-alpha/frontend/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # 前端路由（SPA）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 4.3 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/project-alpha /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

### Step 5: SSL 证书（可选但推荐）

#### 5.1 安装 Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 5.2 获取证书

```bash
# 自动配置 SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 按提示输入邮箱和同意条款
```

#### 5.3 自动续期

```bash
# Certbot 会自动添加续期任务，验证：
sudo certbot renew --dry-run
```

---

### Step 6: 防火墙配置

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 'Nginx Full'

# 允许 SSH
sudo ufw allow OpenSSH

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

## 🔍 监控和维护

### PM2 监控

```bash
# 查看应用状态
pm2 status

# 查看实时日志
pm2 logs project-alpha-api

# 查看资源使用
pm2 monit

# 重启应用
pm2 restart project-alpha-api

# 停止应用
pm2 stop project-alpha-api

# 删除应用
pm2 delete project-alpha-api
```

### 日志管理

```bash
# 查看 Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 查看应用日志
pm2 logs project-alpha-api --lines 100

# 清理旧日志
pm2 flush
```

### 数据库备份

```bash
# 创建备份脚本
cat > /var/www/project-alpha/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u ticket_user -p'your_password' ticket_manager > $BACKUP_DIR/ticket_manager_$DATE.sql

# 保留最近7天的备份
find $BACKUP_DIR -name "ticket_manager_*.sql" -mtime +7 -delete

echo "Backup completed: ticket_manager_$DATE.sql"
EOF

# 添加执行权限
chmod +x /var/www/project-alpha/backup.sh

# 设置定时任务（每天凌晨2点）
crontab -e
# 添加：
0 2 * * * /var/www/project-alpha/backup.sh
```

---

## 🔧 性能优化

### 数据库优化

```bash
# 运行性能检查脚本
mysql -u ticket_user -p ticket_manager < /var/www/project-alpha/database/performance-check.sql

# 定期优化表
mysqlcheck -u ticket_user -p --optimize ticket_manager
```

### Nginx 优化

在 `/etc/nginx/nginx.conf` 中添加：

```nginx
# 工作进程数（通常等于 CPU 核心数）
worker_processes auto;

# 最大连接数
events {
    worker_connections 2048;
}

http {
    # 开启 Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript;

    # 连接保活
    keepalive_timeout 65;

    # 客户端请求体大小限制
    client_max_body_size 10M;
}
```

---

## 🛡️ 安全加固

### 1. 服务器安全

```bash
# 禁用 root SSH 登录
sudo nano /etc/ssh/sshd_config
# 设置: PermitRootLogin no

# 修改 SSH 端口（可选）
# 设置: Port 2222

# 重启 SSH
sudo systemctl restart sshd
```

### 2. MySQL 安全

```bash
# 只允许本地连接
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# 设置: bind-address = 127.0.0.1

# 重启 MySQL
sudo systemctl restart mysql
```

### 3. 应用安全

- ✅ 使用强密码
- ✅ 定期更新依赖
- ✅ 启用 API 限流
- ✅ 配置 CORS 白名单
- ✅ 使用 HTTPS
- ✅ 定期备份数据

---

## 🚨 故障排查

### 后端无法启动

```bash
# 1. 检查端口是否被占用
sudo lsof -i :3000

# 2. 检查数据库连接
mysql -u ticket_user -p -h 127.0.0.1

# 3. 查看应用日志
pm2 logs project-alpha-api --err

# 4. 检查环境变量
cat /var/www/project-alpha/backend/.env
```

### 前端无法访问

```bash
# 1. 检查 Nginx 状态
sudo systemctl status nginx

# 2. 检查 Nginx 配置
sudo nginx -t

# 3. 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 4. 检查文件权限
ls -la /var/www/project-alpha/frontend/dist
```

### 数据库连接失败

```bash
# 1. 检查 MySQL 状态
sudo systemctl status mysql

# 2. 检查用户权限
mysql -u root -p
SHOW GRANTS FOR 'ticket_user'@'localhost';

# 3. 测试连接
mysql -u ticket_user -p -h 127.0.0.1 ticket_manager
```

---

## 📊 监控建议

### 推荐监控工具

1. **服务器监控**
   - Prometheus + Grafana
   - Netdata（轻量级）

2. **应用监控**
   - PM2 Plus（付费）
   - New Relic（APM）
   - Sentry（错误追踪）

3. **日志管理**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Papertrail

---

## 🔄 更新部署

### 零停机更新

```bash
cd /var/www/project-alpha

# 1. 拉取最新代码
git pull origin main

# 2. 更新后端
cd backend
npm install --production
npm run build
pm2 reload ecosystem.config.js

# 3. 更新前端
cd ../frontend
npm install
npm run build
# Nginx 会自动使用新的静态文件

# 4. 验证
curl http://localhost:3000/api/health
```

---

## 📋 部署检查清单

部署完成后，请确认以下项目：

- [ ] 数据库已创建并导入结构
- [ ] 后端 API 正常运行（健康检查）
- [ ] 前端页面可以访问
- [ ] SSL 证书已配置（HTTPS）
- [ ] 防火墙已配置
- [ ] PM2 开机自启已设置
- [ ] 数据库备份任务已配置
- [ ] 监控工具已部署
- [ ] 日志轮转已配置
- [ ] 错误追踪已配置

---

## 📞 技术支持

如遇部署问题，请：

1. 查看本文档的故障排查章节
2. 查看应用日志和服务器日志
3. 提交 Issue 到 GitHub

---

**文档版本：** v1.0.0  
**最后更新：** 2025-12-21  
**维护者：** Project Alpha Team
