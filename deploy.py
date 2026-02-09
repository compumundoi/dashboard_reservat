import os
import subprocess
from pathlib import Path
import shutil
from datetime import datetime
import zipfile

REPO_URL = "https://github.com/quiceno95/dashboard_reservat.git"
REPO_DIR = Path("/app/dashboard_reservat")
BRANCH = "main"
DIST_DIR = REPO_DIR / "dist"
NGINX_HTML_DIR = Path("/usr/share/nginx/html")
NGINX_BACKUP_DIR = Path("/usr/share/nginx/backups")

def run_command(command, cwd=None):
    print(f"🚀 Ejecutando: {command}")
    result = subprocess.run(command, shell=True, cwd=cwd)
    if result.returncode != 0:
        raise RuntimeError(f"❌ Error ejecutando: {command}")

def clone_or_pull_repo():
    if not REPO_DIR.exists():
        print(f"📥 Clonando repositorio en {REPO_DIR}...")
        run_command(f"git clone -b {BRANCH} {REPO_URL} {REPO_DIR}")
    else:
        print(f"🔄 Repositorio ya existe. Haciendo pull...")
        run_command("git pull origin main", cwd=REPO_DIR)

def build_project():
    print("📦 Instalando dependencias y construyendo proyecto...")
    run_command("npm install", cwd=REPO_DIR)
    run_command("npm run build", cwd=REPO_DIR)

def validate_dist():
    if not DIST_DIR.exists() or not any(DIST_DIR.iterdir()):
        raise FileNotFoundError("❌ La carpeta dist/ no fue generada correctamente.")
    print("✅ Carpeta dist/ generada correctamente.")

def zip_nginx_backup():
    if not NGINX_HTML_DIR.exists():
        print(f"⚠️ Carpeta {NGINX_HTML_DIR} no existe. Se omite backup.")
        return

    NGINX_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_path = NGINX_BACKUP_DIR / f"nginx_backup_{timestamp}.zip"

    print(f"🗄️  Generando backup en: {zip_path}")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as backup_zip:
        for root, _, files in os.walk(NGINX_HTML_DIR):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(NGINX_HTML_DIR)
                backup_zip.write(file_path, arcname)

    print("✅ Backup completado.")

def deploy_to_nginx():
    print(f"📤 Copiando archivos de dist/ a {NGINX_HTML_DIR}...")
    run_command(f"sudo rm -rf {NGINX_HTML_DIR}/*")
    run_command(f"sudo cp -r {DIST_DIR}/* {NGINX_HTML_DIR}/")
    print("✅ Deploy completado exitosamente en Nginx.")

def main():
    try:
        clone_or_pull_repo()
        build_project()
        validate_dist()
        zip_nginx_backup()
        deploy_to_nginx()
    except Exception as e:
        print(f"💥 Error en el proceso: {e}")

if __name__ == "__main__":
    main()