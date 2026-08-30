import os
import sys
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

try:
    import paramiko
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "paramiko"])
    import paramiko

# Load configuration from .env.deploy or environment variables
def load_env(env_path):
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env_vars[k.strip()] = v.strip()
    return env_vars

script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(script_dir)
env_path = os.path.join(root_dir, '.env.deploy')

env = load_env(env_path)

host = env.get('VPS_HOST', '72.60.221.173')
user = env.get('VPS_USER', 'root')
password = env.get('VPS_PASSWORD', "(qh'8GC/6+mXt8fJ")
pat = env.get('GITHUB_PAT', '')
gh_user = env.get('GITHUB_USER', 'marshadkhn')
gh_repo = env.get('GITHUB_REPO', 'magicteal/dlaven-website')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

print(f"Connecting to VPS ({host})...")
ssh.connect(host, username=user, password=password, timeout=30)

def run(cmd, timeout=900):
    print(f"\n=================== [ {cmd} ] ===================")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print(out.strip())
    if err:
        print("ERR:", err.strip())
    return out

# 1. Update Git repository on VPS
authenticated_url = f"https://{gh_user}:{pat}@github.com/{gh_repo}.git" if pat else f"https://github.com/{gh_repo}.git"
print("\n1. Updating git remote and pulling latest commit on VPS...")
run(f"su - deploy -c 'cd /home/deploy/myapp && git remote set-url origin {authenticated_url} && git fetch origin && git reset --hard origin/main'")

# 2. Build Backend
print("\n2. Building Backend...")
run("su - deploy -c 'cd /home/deploy/myapp/Backend && npm install && npm run build'")
print("\n2b. Ensuring Admin Account on VPS DB...")
run("su - deploy -c 'cd /home/deploy/myapp/Backend && npx ts-node src/makeAdmin.ts'")
run("su - deploy -c 'cd /home/deploy/myapp/Backend && npx ts-node src/makeAdminAtlas.ts'")

# 3. Build Frontend
print("\n3. Building Frontend...")
run("su - deploy -c 'cd /home/deploy/myapp/Frontend && npm install && npm run build'")

# 4. Restart PM2 Services
print("\n4. Restarting PM2 Services...")
run("su - deploy -c 'pm2 restart all'")

# 5. Check PM2 Status
print("\n5. Checking PM2 Status & Running Processes...")
status_output = run("su - deploy -c 'pm2 status'")

ssh.close()

if "online" in status_output:
    print("\n✅ VPS Deployment successfully completed and services are ONLINE!")
else:
    print("\n⚠️ VPS Deployment finished, but check PM2 status output above for issues.")
