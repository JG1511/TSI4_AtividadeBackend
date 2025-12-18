# Deploy na AWS (Backend + Frontend + MySQL)

Este guia explica como colocar o sistema **AutoPrime** no ar na AWS usando:
- **Backend Django** no **Elastic Beanstalk**
- **MySQL** no **RDS**
- **Frontend estático (HTML/CSS/JS)** no **S3 (Static Website Hosting)**

> Importante: o projeto Django foi renomeado para `main` (ou seja, o settings é `main.settings` e o WSGI é `main.wsgi:application`).

---

## 1) Criar o MySQL no RDS

1. AWS Console → **RDS** → **Create database**
2. Engine: **MySQL** (8.0)
3. Crie um banco (ex.: `carros`) e um usuário (ex.: `admin`)
4. Anote:
   - **Endpoint** do RDS (host)
   - **DB name**
   - **User** e **Password**
5. No Security Group do RDS, libere **porta 3306** somente para o Security Group do Elastic Beanstalk (recomendado).

---

## 2) Deploy do Backend (Django) no Elastic Beanstalk

### 2.1 Pré-requisitos no computador do professor
- Python 3.11+
- AWS CLI configurado (`aws configure`)
- EB CLI (`pip install awsebcli`)

### 2.2 Inicializar e criar o ambiente
Abra um terminal **na pasta** `backend/` (uma vez só):

```powershell
cd backend
pip install awsebcli

eb init -p python-3.11 autoprime-backend

eb create autoprime-backend-prod
```

### 2.3 Configurar variáveis de ambiente do EB
Configure no EB (pelo console ou via CLI) as variáveis abaixo.

Exemplo via CLI:

```powershell
cd backend

eb setenv \
  DEBUG=False \
  SECRET_KEY="troque-por-uma-chave-forte" \
  ALLOWED_HOSTS=".elasticbeanstalk.com" \
  DB_NAME="carros" \
  DB_USER="admin" \
  DB_PASSWORD="SUA_SENHA" \
  DB_HOST="SEU_ENDPOINT_RDS" \
  DB_PORT="3306" \
  CORS_ALLOW_ALL=False \
  CORS_ALLOWED_ORIGINS="https://SEU_FRONTEND_S3_URL"
```

### 2.4 Fazer deploy

```powershell
cd backend

eb deploy
```

### 2.5 Rodar migrações no ambiente
Após o deploy, rode migrações:

```powershell
cd backend

eb ssh
cd /var/app/current
source /var/app/venv/*/bin/activate
python manage.py migrate --noinput
exit
```

> O `Procfile` e `.ebextensions` já estão configurados para `main.wsgi:application`.

---

## 3) Deploy do Frontend no S3

### 3.1 Ajustar URL do backend no frontend
No arquivo `frontend/js/config.js`, ajuste o `BASE_URL` para a URL do Elastic Beanstalk.

Exemplo:
- `BASE_URL: 'http://SEU-APP.elasticbeanstalk.com'`

### 3.2 Criar bucket e habilitar site estático
1. AWS Console → **S3** → Create bucket (ex.: `autoprime-frontend-seu-nome`)
2. Abra o bucket → **Properties** → **Static website hosting** → Enable
   - Index document: `index.html`

### 3.3 Fazer upload dos arquivos
Faça upload do conteúdo da pasta `frontend/` para o bucket.

Opcional via AWS CLI:

```powershell
cd frontend
aws s3 sync . s3://autoprime-frontend-seu-nome --acl public-read
```

### 3.4 Liberar leitura pública
No bucket → Permissions → ajuste a política para permitir leitura pública (ou use CloudFront com OAC, se o professor preferir).

---

## 4) CORS (obrigatório)

No backend, o CORS precisa permitir exatamente a URL do frontend.
Exemplo de `CORS_ALLOWED_ORIGINS`:
- `http://autoprime-frontend-seu-nome.s3-website-us-east-1.amazonaws.com`

Se mudar a URL do frontend, atualize o EB:

```powershell
cd backend

eb setenv CORS_ALLOWED_ORIGINS="NOVA_URL_DO_FRONTEND"

eb deploy
```

---

## 5) Verificação final

- Abra o frontend (URL do S3)
- Teste:
  - Adicionar carro
  - Listar carros
  - Editar e deletar
- Se der erro, verifique logs:

```powershell
cd backend

eb logs
```
