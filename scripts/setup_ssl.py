import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

host = '72.60.221.173'
user = 'root'
password = "(qh'8GC/6+mXt8fJ"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, username=user, password=password, timeout=15)

def run(cmd):
    print(f"\n=== [ {cmd} ] ===")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=30)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print(out.strip())
    if err:
        print("ERR:", err.strip())
    return out

# 1. Generate SSL certificate
run("openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -subj '/CN=72.60.221.173'")

# 2. Check sites-enabled
run("ls -la /etc/nginx/sites-enabled/")

# 3. Create Nginx config
nginx_conf = """server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    server_name 72.60.221.173 _;

    client_max_body_size 50m;

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
"""

sftp = ssh.open_sftp()
with sftp.file('/etc/nginx/sites-available/default', 'w') as f:
    f.write(nginx_conf)
sftp.close()

# 4. Ensure symlink in sites-enabled
run("ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default")

# 5. Test and reload Nginx
run("nginx -t")
run("systemctl restart nginx")

# 6. Test HTTP and HTTPS
run("curl -I http://localhost")
run("curl -k -I https://localhost")
run("curl -k -I https://72.60.221.173")

ssh.close()
print("\nDone!")
