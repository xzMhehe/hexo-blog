---
title: '【Nginx】Windows生成ssl证书,Nginx反向代理HTTPS'
date: 2024-07-26 09:40:54
tags:
  - Nginx
categories:
  - Nginx
keywords:
  - Nginx
description: Nginx
headimg: https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/mo/20240726142002.png
thumbnail: https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/mo/20240726142002.png
---

## 下载 OpenSSL
环境 Windows、Linux, 证书我是在Windows上生成的自签证书。

```bash
https://slproweb.com/products/Win32OpenSSL.html


Win64 OpenSSL v3.3.1
EXE（这个） | MSI
```

Select Additional Tasks页面勾选 The OpenSSL binaries (/bin) directory

然后将OpenSSL的bin目录配置到path中
```bash
C:\Program Files\OpenSSL-Win64\bin;
```

## 创建自签证书
**生成私钥文件**
```bash
openssl genrsa -des3 -out codingce.com.cn.key 2048
```

**去除口令，否则启动Nginx时需要密码**
```bash
openssl rsa -in codingce.com.cn.key -out codingce.com.cn.key
```

**创建请求证书**
```bash
openssl req -new -key codingce.com.cn.key -out codingce.com.cn.csr
```

所填写内容示例
```bash
Country Name (2 letter code) [AU]:CN
State or Province Name (full name) [Some-State]:Beijing
Locality Name (eg, city) []:Beijing
Organization Name (eg, company) [Internet Widgits Pty Ltd]:CODINGCE
Organizational Unit Name (eg, section) []:DEV
Common Name (e.g. server FQDN or YOUR name) []:codingce.com.cn
Email Address []:root@codingce.com.cn

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:CODINGCE
```


**生成证书**
```bash
openssl x509 -req -days 36500 -in codingce.com.cn.csr -signkey codingce.com.cn.key  -out codingce.com.cn.crt -extfile codingce.com.cn.ext
```

codingce.com.cn.ext
```ini
basicConstraints = CA:FALSE

keyUsage = nonRepudiation, digitalSignature, keyEncipherment

subjectAltName = @alt_names

[alt_names]

DNS.1 = codingce.com.cn
```

## 概念

### 代理
在Java设计模式中，代理模式是这样定义的：给某个对象提供一个代理对象，并由代理对象控制原对象的引用。

可能大家不太明白这句话，在举一个现实生活中的例子：比如我们要买一间二手房，虽然我们可以自己去找房源，但是这太花费时间精力了，而且房屋质量检测以及房屋过户等一系列手续也都得我们去办，再说现在这个社会，等我们找到房源，说不定房子都已经涨价了，那么怎么办呢？最简单快捷的方法就是找二手房中介公司（为什么？别人那里房源多啊），于是我们就委托中介公司来给我找合适的房子，以及后续的质量检测过户等操作，我们只需要选好自己想要的房子，然后交钱就行了。

代理简单来说，就是如果我们想做什么，但又不想直接去做，那么这时候就找另外一个人帮我们去做。那么这个例子里面的中介公司就是给我们做代理服务的，我们委托中介公司帮我们找房子。

Nginx 主要能够代理如下几种协议，其中用到的最多的就是做Http代理服务器。

- http/https(HTTP Server)
- ICMP/POP/IMAP(Mail Server)
- RTMP(Media Server)

### 正向代理
大家都知道，现在国内是访问不了 Google的，那么怎么才能访问 Google呢？我们又想，美国人不是能访问 Google吗（这不废话，Google就是美国的），如果我们电脑的对外公网 IP 地址能变成美国的 IP 地址，那不就可以访问 Google了。你很聪明，VPN 就是这样产生的。我们在访问 Google 时，先连上 VPN 服务器将我们的 IP 地址变成美国的 IP 地址，然后就可以顺利的访问了。

这里的 VPN 就是做正向代理的。正向代理服务器位于客户端和服务器之间，为了向服务器获取数据，客户端要向代理服务器发送一个请求，并指定目标服务器，代理服务器将目标服务器返回的数据转交给客户端。这里客户端是要进行一些正向代理的设置的。

### 反向代理
反向代理和正向代理的区别就是：正向代理代理客户端，反向代理代理服务器。

反向代理，其实客户端对代理是无感知的，因为客户端不需要任何配置就可以访问，我们只需要将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据后，在返回给客户端，此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实服务器IP地址。

## Nginx反向代理

### 背景需求
我的环境是 A 内网机器不能访问公网，B 机器能访问公网，目的就是 A 机器通过 B 机器反向代理访问公网。

### A 机器
通过修改 A 机器的HOST文件来模拟内网域名(codingce.com.cn)解析到 B 机器。

```bash
C:\Windows\System32\drivers\etc

192.168.56.101  codingce.com.cn
```

### B 机器
**Nginx 版本**：nginx-1.25.4

**Nginx 配置 nginx.conf**
```bash
#user  nobody;
worker_processes  1;

events {
    worker_connections  1024;
}


http {
	server_names_hash_bucket_size 64;
    include       mime.types;
    default_type  application/octet-stream;
    # 包含自定义配置文件
	include       vhost/*.conf;

    sendfile        on;

    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

}
```

**Nginx 配置 codingce.conf**
D:\nginx-1.25.4\nginx-1.25.4\conf\vhost
```bash
# codingce.com.cn
server {
    listen 443 ssl;
    server_name codingce.com.cn;

    ssl_certificate "D:\\Nginx\\nginx-1.25.4\\nginx-1.25.4\\conf\\vhost\\codingce.com.cn.crt";
    ssl_certificate_key "D:\\Nginx\\nginx-1.25.4\\nginx-1.25.4\\conf\\vhost\\codingce.com.cn.key";
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass https://codingce.com.cn;
        proxy_ssl_verify off;
        proxy_ssl_server_name on;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_set_header Host codingce.com.cn;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Linux版本
```bash
server {
    listen 443 ssl;
    server_name codingce.com.cn;

    ssl_certificate /path/to/codingce.com.cn.crt;
    ssl_certificate_key /path/to/codingce.com.cn.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass https://codingce.com.cn;
        proxy_ssl_verify off;
        proxy_ssl_server_name on;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_set_header Host codingce.com.cn;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 启动 nginx
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf

# 重启
/usr/local/nginx/sbin/nginx -s reload
```


证书：
<img width="380px" src="https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/mo/20240726143749.png"/>

自签证书浏览器无法识别安全性，需要手动添加 受信任的根证书颁发机构，不然上线的时候会有证书无效问题。

<img width="380px" src="https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/mo/20240726143235.png"/>

A 机器 控制台访问
<img width="380px" src="https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/mo/20240726144530.png"/>

