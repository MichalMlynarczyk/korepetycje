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

- Publiczny adres przez Caddy: `https://nastomatma.pl`
- Frontend: dostepny tylko wewnatrz sieci Docker dla Caddy
- Backend: dostepny tylko wewnatrz sieci Docker dla Caddy
- PostgreSQL: dostepny tylko wewnatrz prywatnej sieci Docker dla backendu

Mapowanie portow Docker Compose:

- Caddy: `0.0.0.0:80->80`, `0.0.0.0:443->443`
- Backend, frontend i PostgreSQL nie publikuja portow na hosta

Przed uruchomieniem produkcyjnym ustaw wymagane sekrety w `.env`. Szablon znajduje sie w `.env.example`.

Backend przy starcie wykonuje migracje, synchronizuje aplikacje OAuth i zbiera pliki statyczne.

Baza danych jest trzymana w wolumenie `postgres_data`, a media backendu w `backend_media`.
