---
title: 免费使用ssl证书
date: 2024-06-25 22:05:36
updated: 2024-06-25 22:05:36
categories: Linux
tags: Linux
---

>   [Let’s Encrypt](https://letsencrypt.org/) 是一个于2015年推出的数字证书认证机构，将通过旨在消除当前手动创建和安装证书的复杂过程的自动化流程，为安全网站提供免费的SSL/TLS证书。这是由[互联网安全研究小组](https://letsencrypt.org/isrg/)（ISRG – Internet Security Research Group，一个公益组织）提供的服务。主要赞助商包括[电子前哨基金会](https://www.eff.org/)，[Mozilla基金会](https://www.mozilla.org/foundation/)，[Akamai](https://www.akamai.com/)以及Cisco等公司。

## 1. 安装certbot 

 [https://certbot.eff.org](https://certbot.eff.org/) 

1. 安装 EPEL 仓库（如果尚未安装）：

   ```bash
   sudo apt update
   sudo apt install epel-release
   ```

2. 安装 Certbot 及其 Nginx 插件：

	 ```bash
	 sudo apt install certbot python2-certbot-nginx
	```

会列出所有的nginx服务，回车默认全选

> 1. 证书位置：你的证书和链文件已保存在 /etc/letsencrypt/live/xxx.cn/fullchain.pem，而私钥文件保存在 /etc/letsencrypt/live/xxx.cn/privkey.pem。这些是配置服务器 SSL 的关键文件。
> 2. 证书到期：你的证书将在 xxxx-xx-xx 到期。为了保持网站的安全，你需要在这个日期之前续期你的证书。
>
> 1. 续期证书：未来要续期或修改证书，只需再次运行 Certbot 并使用 "certonly" 选项即可。为了简化续期过程，可以运行 certbot renew 命令以非交互方式续期所有证书

安装完成后nginx配置中会新增一些配置

这里建议配置 **http2**，这要求 Nginx 版本要大于 1.9.5。HTTP2 具有更快的 HTTPS 传输性能，非常值得开启。

需要开启HTTP/2其实很简单，只需要在 nginx.conf 的 listen 443 ssl; 后面加上 http2 就好了。如下所示：

```bash
listen 443 ssl http2; # managed by Certbot
ssl_certificate /etc/letsencrypt/live/xxx.cn/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/xxx.cn/privkey.pem; # managed by Certbot
include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
```

然后，重启nginx `nginx -s reload` 

## 2. 配置自动更新

Let’s Encrypt 的证书90天就过期了，所以，你还要设置上自动化的更新脚本，最容易的莫过于使用 crontab 了。使用 crontab -e 命令加入如下的定时作业（每个月都强制更新一下）：

1. 输入命令 crontab -e 打开当前用户的 crontab 文件。如果你是以 root 用户运行 Certbot（通常是这种情况），你应该以 root 用户身份运行这个命令。

2. 设置每月自动续期：
   如果你想每个月自动尝试更新证书，并在更新后重启 Nginx 以应用新的证书，可以添加以下两行到你的 crontab 文件中：

```shell
0 0 1 * * /usr/bin/certbot renew --force-renewal
5 0 1 * * /usr/sbin/service nginx restart
```

## 3. 扩展证书

```bash
sudo certbot --expand -d xxxx.com -d xxx.xxxx.com
```

## 4. 创建新证书

```bash
sudo certbot --nginx -d xxx.xxx.com
```

## 5. 列出所有证书

```bash
sudo certbot certificates
```

## 6. 删除某个证书

```bash
sudo certbot delete --cert-name your-cert-name
```

### 参考：

- [如何免费的让网站启用HTTPS(coolshell)](https://coolshell.cn/articles/18094.html)
