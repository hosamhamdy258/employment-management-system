from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
import re


class RequiredFieldsModel(models.Model):
    required_fields = []

    class Meta:
        abstract = True
        ordering = ['-id']

    def clean(self):
        errors = {}
        for field in self.required_fields:
            if not getattr(self, field):
                errors[field] = f"{field.replace('_', ' ').title()} is required."
        if errors:
            raise ValidationError(errors)


class Company(RequiredFieldsModel):
    required_fields = ["name"]
    name = models.CharField(max_length=255, unique=True)

    def delete(self, *args, **kwargs):
        # Prevent deletion if company has departments or employees
        if self.num_departments > 0:
            raise ValidationError(f"Cannot delete company '{self.name}' as it has {self.num_departments} department(s). Please remove all departments first.")
        if self.num_employees > 0:
            raise ValidationError(f"Cannot delete company '{self.name}' as it has {self.num_employees} employee(s). Please remove all employees first.")
        super().delete(*args, **kwargs)

    @property
    def num_departments(self):
        return getattr(self, '_num_departments', Department.objects.filter(company=self).count())

    @property
    def num_employees(self):
        return getattr(self, '_num_employees', Employee.objects.filter(company=self).count())

    def __str__(self):
        return self.name


class Department(RequiredFieldsModel):
    required_fields = ["company", "name"]
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta(RequiredFieldsModel.Meta):
        unique_together = ("company", "name")

    def clean(self):
        super().clean()
        # Prevent changing company if department has employees
        if self.pk:  # Only check for existing departments (not new ones)
            try:
                old_department = Department.objects.get(pk=self.pk)
                if old_department.company != self.company and self.num_employees > 0:
                    raise ValidationError({"company": f"Cannot change company for this department as it has {self.num_employees} employee(s). Please move or remove employees first."})
            except Department.DoesNotExist:
                pass  # New department, no constraint needed

    def delete(self, *args, **kwargs):
        # Prevent deletion if department has employees
        if self.num_employees > 0:
            raise ValidationError(f"Cannot delete department '{self.name}' as it has {self.num_employees} employee(s). Please remove all employees first.")
        super().delete(*args, **kwargs)

    @property
    def num_employees(self):
        return Employee.objects.filter(department=self).count()

    def __str__(self):
        return f"{self.name} ({self.company.name})"


class Employee(RequiredFieldsModel):
    required_fields = ["company", "department", "name", "email", "mobile"]

    class Status(models.TextChoices):
        APPLICATION_RECEIVED = "APPLICATION_RECEIVED", "Application Received"
        INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED", "Interview Scheduled"
        HIRED = "HIRED", "Hired"
        NOT_ACCEPTED = "NOT_ACCEPTED", "Not Accepted"

    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.APPLICATION_RECEIVED)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    mobile = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    designation = models.CharField(max_length=255)
    hired_on = models.DateField(null=True, blank=True)

    def clean(self):
        super().clean()
        errors = {}
        if self.department and self.company and self.department.company_id != self.company_id:
            errors["department"] = "Department must belong to the selected company."
        if not re.match(r"^\+?\d{10,15}$", self.mobile or ""):
            errors["mobile"] = "Enter a valid mobile number (10-15 digits, optional +)."
        if errors:
            raise ValidationError(errors)

    @property
    def days_employed(self):
        if self.hired_on:
            return (timezone.now().date() - self.hired_on).days
        return None

    def __str__(self):
        return f"{self.name} ({self.company.name} - {self.department.name})"
