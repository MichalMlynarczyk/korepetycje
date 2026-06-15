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

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

Backend przy starcie wykonuje migracje i tworzy konto nauczyciela:

- login: `kuba@admin.com`
- haslo: `admin123`

Baza danych jest trzymana w wolumenie `postgres_data`, a media backendu w `backend_media`.
