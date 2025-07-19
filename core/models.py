from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
import re


class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def clean(self):
        if not self.name:
            raise ValidationError({"name": "Company name is required."})

    @property
    def num_departments(self):
        return Department.objects.filter(company=self).count()

    @property
    def num_employees(self):
        return Employee.objects.filter(company=self).count()

    def __str__(self):
        return self.name


class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ("company", "name")

    def clean(self):
        if not self.name:
            raise ValidationError({"name": "Department name is required."})
        if not self.company:
            raise ValidationError({"company": "Company is required."})

    @property
    def num_employees(self):
        return Employee.objects.filter(department=self).count()

    def __str__(self):
        return f"{self.name} ({self.company.name})"





class Employee(models.Model):
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
    
    
    # default_error_messages = {
    #     "invalid_choice": _("Value %(value)r is not a valid choice."),
    #     "null": _("This field cannot be null."),
    #     "blank": _("This field cannot be blank."),
    #     "unique": _("%(model_name)s with this %(field_label)s already exists."),
    #     "unique_for_date": _(
    #         # Translators: The 'lookup_type' is one of 'date', 'year' or
    #         # 'month'. Eg: "Title must be unique for pub_date year"
    #         "%(field_label)s must be unique for "
    #         "%(date_field_label)s %(lookup_type)s."
    #     ),
    # }

    def clean(self):
        errors = {}
        if not self.name:
            errors["name"] = "Employee name is required."
        if not self.company:
            errors["company"] = "Company is required."
        if not self.department:
            errors["department"] = "Department is required."
        if self.department and self.company and self.department.company_id != self.company_id:
            errors["department"] = "Department must belong to the selected company."
        if not self.email:
            errors["email"] = "Email is required."
        # if not re.match(r"[^@]+@[^@]+\.[^@]+", self.email or ""):
        #     errors["email"] = "Enter a valid email address."
        if not self.mobile:
            errors["mobile"] = "Mobile number is required."
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
