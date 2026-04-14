# Project Management Tool

A full-stack Project Management application built with **Django REST Framework (backend)** and **React + TypeScript (frontend)**.
This app allows users to manage projects and tasks with secure JWT authentication.

---

## Tech Stack

### Backend

* Django & Django REST Framework
* PostgreSQL (or SQLite for development)
* JWT Authentication (SimpleJWT)
* bcrypt password hashing

### Frontend

* React.js with TypeScript
* Axios for API calls
* Tailwind CSS / MUI (based on your choice)
* React Hook Form + Yup (validation)

---

## Features

### Authentication

* User registration & login
* JWT-based authentication
* Secure password hashing

### Projects

* Create, update, delete projects
* View user-specific projects
* Project status: `active`, `completed`

### Tasks

* CRUD operations for tasks
* Linked to projects
* Status: `todo`, `in-progress`, `done`
* Filter tasks by status
* Due date support

---

## Folder Structure

```
project-root/
├── backend/
│   ├── manage.py
│   ├── apps/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
```

---

## Setup Instructions

### Backend Setup (Django)

```bash
cd backend

# create virtual env
python -m venv venv
venv\Scripts\activate   # Windows

# install dependencies
pip install -r requirements.txt

# apply migrations
python manage.py migrate

# run server
python manage.py runserver
```

---

### Frontend Setup (React)

```bash
cd frontend

# install dependencies
npm install

# start dev server
npm run dev
```

---

## Seed Data (IMPORTANT)

To create sample data:

```bash
python manage.py seed
```

OR create manually:

```bash
python manage.py createsuperuser
```

---

## API Endpoints

### Auth

* POST `/api/register/`
* POST `/api/login/`

### Projects

* GET `/api/projects/`
* POST `/api/projects/`
* PUT `/api/projects/{id}/`
* DELETE `/api/projects/{id}/`

### Tasks

* GET `/api/tasks/`
* POST `/api/tasks/`
* PUT `/api/tasks/{id}/`
* DELETE `/api/tasks/{id}/`

---

## Bonus Features Implemented

* Task filtering
* Form validation (React Hook Form + Yup)
* Clean architecture
* JWT token handling

---

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: PostgreSQL

---

---

##  Author

Rakhi Choudhary

---
