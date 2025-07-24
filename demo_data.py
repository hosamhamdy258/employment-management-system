"""
Demo Data Population Script for Employee Management System

Usage:
    python demo_data.py

This script will create demo companies, departments, employees, and user accounts.
Demo users are created with password: test
"""

import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "employee_mgmt.settings")
django.setup()

from core.models import Company, Department, Employee
from accounts.models import User


# --- Demo Data ---
def populate():
    print("Populating demo companies...")
    companies = []
    for cname in ["Brainwise", "Global Inc", "Tech Solutions", "Umbrella Corp"]:
        company, _ = Company.objects.get_or_create(name=cname)
        companies.append(company)
    print(f"Created {len(companies)} companies.")

    print("Populating demo departments...")
    departments = []
    dept_map = {"Brainwise": ["Engineering", "HR", "Sales"], "Global Inc": ["Research", "Support"], "Tech Solutions": ["Development", "QA"], "Umbrella Corp": ["Biotech", "Security"]}
    for company in companies:
        for dname in dept_map[company.name]:
            dept, _ = Department.objects.get_or_create(company=company, name=dname)
            departments.append(dept)
    print(f"Created {len(departments)} departments.")

    print("Populating demo employees...")
    designations = ["Engineer", "Manager", "Analyst", "Clerk", "Scientist"]
    statuses = [s[0] for s in Employee.Status.choices]
    employees = []
    for i in range(1, 21):
        company = random.choice(companies)
        dept = random.choice([d for d in departments if d.company == company])
        name = f"Employee {i}"
        email = f"employee{i}@{company.name.replace(' ', '').lower()}.com"
        designation = random.choice(designations)
        status = random.choice(statuses)
        hired_on = datetime.now() - timedelta(days=random.randint(0, 1000))
        # Generate a valid E.164 format mobile number
        mobile = f"+1555{random.randint(1000000, 9999999):07d}"
        address = f"{i} Main St, City"
        emp, _ = Employee.objects.get_or_create(
            email=email,
            defaults={
                "name": name,
                "company": company,
                "department": dept,
                "designation": designation,
                "status": status,
                "hired_on": hired_on,
                "mobile": mobile,
                "address": address
            }
        )
        employees.append(emp)
    print(f"Created {len(employees)} employees.")

    print("Creating or updating demo users with password 'test'...")
    user_data = [
        {"email": "admin@demo.com", "role": "ADMIN", "is_staff": True, "is_superuser": True},
        {"email": "manager@demo.com", "role": "MANAGER", "is_staff": True, "is_superuser": False},
        {"email": "employee@demo.com", "role": "EMPLOYEE", "is_staff": False, "is_superuser": False},
    ]

    for data in user_data:
        user, created = User.objects.update_or_create(
            email=data['email'],
            defaults={
                "role": data['role'],
                "is_active": True,
                "is_staff": data['is_staff'],
                "is_superuser": data['is_superuser'],
            }
        )
        user.set_password("test")
        user.save()
        status_msg = "created" if created else "updated"
        print(f"User {user.email} ({user.role}) {status_msg} with password 'test'.")
    print("Demo data population complete.")

    print("Demo data inserted.")


if __name__ == "__main__":
    populate()
