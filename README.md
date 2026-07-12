# Korepetycje

Czysty projekt z frontendem w React + Tailwind oraz backendem w Wagtail.

## Struktura

- `frontend/` - React, Vite, Tailwind
- `backend/` - Django + Wagtail CMS + Wagtail API

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Domyslnie frontend startuje na `http://localhost:5173`.

## Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Panel Wagtail: `http://localhost:8000/admin/`

API Wagtail: `http://localhost:8000/api/v2/`

## Docker

Calosc mozna uruchomic przez Docker Compose:

```bash
docker compose up --build
```

Serwisy:

- Publiczny adres przez Caddy: `http://45.93.139.211`
- Frontend lokalnie: `http://localhost:5173`
- Backend lokalnie: `http://localhost:8001`
- PostgreSQL lokalnie: `localhost:55432`

Mapowanie portow Docker Compose:

- Caddy: `0.0.0.0:80->80`, `0.0.0.0:443->443`
- Backend: `127.0.0.1:8001->8000`
- Frontend: `127.0.0.1:5173->5173`
- PostgreSQL: `127.0.0.1:55432->5432`

Backend przy starcie wykonuje migracje i tworzy konto nauczyciela:

- login: `kuba@admin.com`
- haslo: `admin123`

Baza danych jest trzymana w wolumenie `postgres_data`, a media backendu w `backend_media`.
