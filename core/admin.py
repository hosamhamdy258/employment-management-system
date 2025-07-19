from django.contrib import admin

from .models import Company, Department, Employee


class DepartmentInline(admin.TabularInline):
    model = Department
    extra = 1


class EmployeeInline(admin.TabularInline):
    model = Employee
    extra = 1


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "num_departments", "num_employees")
    search_fields = ("name",)
    inlines = [DepartmentInline]


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "num_employees")
    search_fields = ("name", "company__name")
    inlines = [EmployeeInline]


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "company", "department", "designation", "status", "hired_on")
    search_fields = ("name", "email", "designation", "company__name", "department__name")
    list_filter = ("company", "department", "status")
