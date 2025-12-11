# AutoPrime Backend - API Django

API REST para gerenciamento de carros desenvolvida com Django.

## 📋 Pré-requisitos

- Python 3.11+
- pip
- Conta AWS (para deploy)
- EB CLI (AWS Elastic Beanstalk CLI)

## 🚀 Instalação Local

1. **Clone o repositório e entre na pasta backend:**
```bash
cd backend
```

2. **Crie um ambiente virtual:**
```bash
python -m venv venv
```

3. **Ative o ambiente virtual:**
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

5. **Configure as variáveis de ambiente:**
```bash
copy .env.example .env
```
Edite o arquivo `.env` com suas configurações.

6. **Execute as migrações:**
```bash
python manage.py migrate
```

7. **Inicie o servidor de desenvolvimento:**
```bash
python manage.py runserver
```

O servidor estará disponível em `http://127.0.0.1:8000`

## 📚 Endpoints da API

### Base URL Local
```
http://127.0.0.1:8000/autoprime/
```

### Endpoints Disponíveis

#### 1. Listar todos os carros
- **Método:** GET
- **URL:** `/autoprime/listarCarros/`
- **Resposta:**
```json
{
  "carros": [
    {"id": 1, "modelo": "Corsa", "preco": "20000.00"},
    {"id": 2, "modelo": "Gol", "preco": "25000.00"}
  ]
}
```

#### 2. Buscar preço de um carro
- **Método:** POST
- **URL:** `/autoprime/getCarro/`
- **Body (JSON):**
```json
{
  "modelo": "Corsa"
}
```
- **Resposta:**
```json
{
  "preco": "20000.00"
}
```

#### 3. Salvar um novo carro
- **Método:** POST
- **URL:** `/autoprime/saveCarro/`
- **Body (JSON):**
```json
{
  "modelo": "Corsa",
  "preco": "20000"
}
```
- **Resposta:**
```json
{
  "message": "Carro salvo com sucesso!"
}
```

#### 4. Atualizar um carro
- **Método:** POST
- **URL:** `/autoprime/updateCarro/{id}/`
- **Body (JSON):**
```json
{
  "modelo": "Gol",
  "preco": "25000"
}
```
- **Resposta:**
```json
{
  "message": "Carro atualizado com sucesso!"
}
```

#### 5. Deletar um carro
- **Método:** DELETE
- **URL:** `/autoprime/deleteCarro/{id}/`
- **Resposta:**
```json
{
  "message": "Carro deletado com sucesso!"
}
```

## ☁️ Deploy na AWS Elastic Beanstalk

### Opção 1: Deploy Manual via Console AWS

1. **Prepare o ambiente:**
```bash
pip install awsebcli
```

2. **Inicialize o Elastic Beanstalk:**
```bash
eb init -p python-3.11 autoprime-backend --region us-east-1
```

3. **Crie um ambiente:**
```bash
eb create autoprime-env
```

4. **Configure as variáveis de ambiente no AWS Console:**
   - Acesse o Elastic Beanstalk Console
   - Selecione seu ambiente
   - Configuration → Software → Environment properties
   - Adicione:
     - `SECRET_KEY`: gere uma chave secreta forte
     - `DEBUG`: `False`
     - `ALLOWED_HOSTS`: `seu-app.elasticbeanstalk.com`
     - `CORS_ALLOWED_ORIGINS`: URLs do frontend separadas por vírgula

5. **Faça o deploy:**
```bash
eb deploy
```

6. **Abra a aplicação:**
```bash
eb open
```

### Opção 2: Deploy via AWS Console (Upload ZIP)

1. **Prepare o pacote:**
   - Certifique-se de estar na pasta `backend/`
   - Crie um arquivo ZIP com todos os arquivos (exceto `venv/`, `.git/`, `__pycache__/`)

2. **Acesse o AWS Elastic Beanstalk Console:**
   - https://console.aws.amazon.com/elasticbeanstalk

3. **Crie uma nova aplicação:**
   - Clique em "Create Application"
   - Nome: `autoprime-backend`
   - Platform: Python 3.11
   - Application code: Upload your code (selecione o ZIP)

4. **Configure as variáveis de ambiente:**
   - Configuration → Software → Environment properties
   - Adicione as variáveis mencionadas acima

5. **Aguarde o deploy** (pode levar alguns minutos)

### Opção 3: Deploy via EC2 (Alternativa)

1. **Conecte-se à instância EC2:**
```bash
ssh -i sua-chave.pem ec2-user@seu-ip-publico
```

2. **Instale as dependências:**
```bash
sudo yum update -y
sudo yum install python3.11 python3-pip git -y
```

3. **Clone o repositório:**
```bash
git clone seu-repositorio.git
cd backend
```

4. **Configure o ambiente:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. **Configure variáveis de ambiente:**
```bash
nano .env
```

6. **Execute as migrações:**
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

7. **Inicie com Gunicorn:**
```bash
gunicorn --bind 0.0.0.0:8000 --workers 3 backend.wsgi:application
```

8. **Configure como serviço (opcional):**
Crie `/etc/systemd/system/autoprime.service`:
```ini
[Unit]
Description=AutoPrime Django API
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/backend
Environment="PATH=/home/ec2-user/backend/venv/bin"
EnvironmentFile=/home/ec2-user/backend/.env
ExecStart=/home/ec2-user/backend/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Ative o serviço:
```bash
sudo systemctl enable autoprime
sudo systemctl start autoprime
```

## 🔒 Segurança em Produção

Antes do deploy, certifique-se de:

1. ✅ Gerar uma nova `SECRET_KEY` (não use a padrão!)
2. ✅ Definir `DEBUG=False`
3. ✅ Configurar `ALLOWED_HOSTS` corretamente
4. ✅ Configurar `CORS_ALLOWED_ORIGINS` apenas com domínios confiáveis
5. ✅ Usar HTTPS (configure certificado SSL)
6. ✅ Considerar usar banco de dados RDS (PostgreSQL) ao invés de SQLite

## 🗄️ Migrar para PostgreSQL (Recomendado para Produção)

1. **Crie um RDS PostgreSQL na AWS**

2. **Atualize o `.env`:**
```env
DATABASE_URL=postgres://usuario:senha@endpoint-rds.amazonaws.com:5432/autoprime
```

3. **Atualize `settings.py`:**
```python
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}
```

4. **Adicione ao `requirements.txt`:**
```
dj-database-url>=2.1.0
```

## 📝 Notas Importantes

- O projeto usa SQLite por padrão (não recomendado para produção)
- Para produção, recomenda-se PostgreSQL com AWS RDS
- O CSRF está desabilitado nas views (use apenas para testes/desenvolvimento)
- Configure um load balancer e Auto Scaling para alta disponibilidade

## 🐛 Troubleshooting

### Erro de CORS
Configure corretamente `CORS_ALLOWED_ORIGINS` no `.env`

### Erro 500 em produção
Verifique os logs: `eb logs` ou no CloudWatch

### Migrações não executadas
Execute manualmente: `python manage.py migrate`

### Static files não carregando
Execute: `python manage.py collectstatic --noinput`

## 📞 Suporte

Para dúvidas sobre o projeto, consulte a documentação do Django ou AWS Elastic Beanstalk.
