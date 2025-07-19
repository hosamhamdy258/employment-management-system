# Employee Management System (EMS)

A modern Django-based Employee Management System with role-based access, dynamic Bootstrap/HTMX frontend, REST API, and auto-generated Swagger documentation.

---

## Features
- Custom user model (email login, roles: Admin/Manager/Employee)
- CRUD for Company, Department, Employee
- Role-based access control (frontend and API)
- HTMX-powered dynamic UI (no page reloads)
- Bootstrap 5 styling, toasts for all feedback
- Dynamic department dropdown in employee form
- Django admin for all models
- REST API (DRF) for all entities
- Interactive API docs (Swagger/Redoc)
- Demo data script for easy setup

---

## Quick Start

### 1. Clone & Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Apply Migrations
```bash
python manage.py migrate
```

### 3. Populate Demo Data
```bash
python demo_data.py
```
- Companies, departments, employees, and demo users will be created.
- Demo users:
  - **admin@demo.com** (role: ADMIN, password: `test`)
  - **manager@demo.com** (role: MANAGER, password: `test`)
  - **employee@demo.com** (role: EMPLOYEE, password: `test`)

### 4. Run the Development Server
```bash
python manage.py runserver
```

- App: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Admin: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- Swagger: [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)
- Redoc: [http://127.0.0.1:8000/redoc/](http://127.0.0.1:8000/redoc/)

---

## Usage
- Login as any demo user (see above)
- Manage companies, departments, and employees
- Only Admins/Managers can create/edit/delete
- Employees can view their own info
- All actions provide instant feedback via Bootstrap toasts

---

## API Documentation
- **Swagger UI:** `/swagger/`
- **Redoc:** `/redoc/`
- Full RESTful CRUD for Company, Department, Employee
- Auth required for all endpoints

---

## Project Structure
- `accounts/` — Custom user model and logic
- `core/` — Main business models, views, API, demo data
- `templates/` — Bootstrap/HTMX frontend
- `demo_data.py` — Demo data script

---

## Security & Notes
- CSRF protection for all forms and HTMX requests
- Demo user passwords are set to `test` (change in production!)
- No custom CSS; all styling via Bootstrap 5

---

## License
MIT (or your license here)
