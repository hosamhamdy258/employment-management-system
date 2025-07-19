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
    for cname in ["Acme Corp", "Globex Inc", "Initech", "Umbrella LLC"]:
        company, _ = Company.objects.get_or_create(name=cname)
        companies.append(company)
    print(f"Created {len(companies)} companies.")

    print("Populating demo departments...")
    departments = []
    dept_map = {"Acme Corp": ["Engineering", "HR", "Sales"], "Globex Inc": ["Research", "Support"], "Initech": ["Development", "QA"], "Umbrella LLC": ["Biotech", "Security"]}
    for company in companies:
        for dname in dept_map[company.name]:
            dept, _ = Department.objects.get_or_create(company=company, name=dname)
            departments.append(dept)
    print(f"Created {len(departments)} departments.")

    print("Populating demo employees...")
    designations = ["Engineer", "Manager", "Analyst", "Clerk", "Scientist"]
    statuses = [s[0] for s in Employee.Status.choices]
    for i in range(1, 21):
        company = random.choice(companies)
        dept = random.choice([d for d in departments if d.company == company])
        name = f"Employee {i}"
        email = f"employee{i}@{company.name.replace(' ', '').lower()}.com"
        designation = random.choice(designations)
        status = random.choice(statuses)
        hired_on = datetime.now() - timedelta(days=random.randint(0, 1000))
        mobile = f"+1-555-{random.randint(1000,9999)}"
        address = f"{i} Main St, City"
        Employee.objects.get_or_create(name=name, email=email, company=company, department=dept, designation=designation, status=status, hired_on=hired_on, mobile=mobile, address=address)
    print("Created 20 employees.")

    print("Creating demo users with password 'test'...")
    for email, role in [
        ("admin@demo.com", "ADMIN"),
        ("manager@demo.com", "MANAGER"),
        ("employee@demo.com", "EMPLOYEE"),
    ]:
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "role": role,
                "is_active": True,
                "is_staff": True if role != "EMPLOYEE" else False,
                "is_superuser": True if role == "ADMIN" else False,
            },
        )
        user.set_password("test")
        user.save()
        print(f"User {email} ({role}) created with password 'test'.")
    print("Demo data population complete.")

    print("Demo data inserted.")


if __name__ == "__main__":
    populate()
