# PM2 服务器部署指南

本项目是一个基于 Next.js 的公务员考试学习网站，以下是使用 PM2 在服务器上部署的完整步骤。

## 前置要求

- Node.js (版本 >= 14.0.0)
- npm 或 pnpm
- PM2 进程管理器
- Git

## 1. 安装 PM2

```bash
# 全局安装 PM2
npm install -g pm2

# 或者使用 yarn
yarn global add pm2
```

## 2. 克隆项目到服务器

```bash
# 克隆项目
git clone <your-repository-url>
cd ShangAnNotes

# 安装依赖
npm install
# 或者
pnpm install
```

## 3. 构建项目

```bash
# 构建生产版本
npm run build
```

## 4. 创建 PM2 配置文件

在项目根目录创建 `ecosystem.config.js` 文件：

```javascript
module.exports = {
  apps: [
    {
      name: 'shangan-notes',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/your/ShangAnNotes',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
}
```

## 5. 创建日志目录

```bash
mkdir logs
```

## 6. 使用 PM2 启动应用

```bash
# 启动应用
pm2 start ecosystem.config.js

# 或者直接启动
pm2 start npm --name "shangan-notes" -- start
```

## 7. PM2 常用命令

```bash
# 查看所有进程
pm2 list

# 查看进程详情
pm2 show shangan-notes

# 查看日志
pm2 logs shangan-notes

# 重启应用
pm2 restart shangan-notes

# 停止应用
pm2 stop shangan-notes

# 删除应用
pm2 delete shangan-notes

# 重新加载应用（零停机时间）
pm2 reload shangan-notes

# 监控
pm2 monit
```

## 8. 设置开机自启

```bash
# 保存当前 PM2 进程列表
pm2 save

# 生成启动脚本
pm2 startup

# 按照提示执行返回的命令（通常需要 sudo 权限）
```

## 9. 配置反向代理（可选）

如果使用 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
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

## 10. 部署脚本示例

创建 `deploy.sh` 脚本用于自动化部署：

```bash
#!/bin/bash

echo "开始部署..."

# 拉取最新代码
git pull origin master

# 安装依赖
npm install

# 构建项目
npm run build

# 重启 PM2 应用
pm2 reload shangan-notes

echo "部署完成！"
```

## 故障排查

1. **检查端口占用**：
   ```bash
   netstat -tlnp | grep :5000
   ```

2. **查看 PM2 日志**：
   ```bash
   pm2 logs shangan-notes --lines 100
   ```

3. **检查应用状态**：
   ```bash
   pm2 show shangan-notes
   ```

4. **重启所有 PM2 进程**：
   ```bash
   pm2 restart all
   ```

## 注意事项

- 确保服务器防火墙开放相应端口（默认 5000）
- 定期备份项目文件和数据库
- 监控服务器资源使用情况
- 建议配置日志轮转以防止日志文件过大
- 在生产环境中使用环境变量管理敏感配置

## 环境变量配置

在项目根目录创建 `.env.production` 文件：

```env
NODE_ENV=production
PORT=5000
# 其他环境变量...
```

通过以上步骤，您就可以成功在服务器上使用 PM2 部署和管理此项目了。