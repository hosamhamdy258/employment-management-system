from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponse, HttpResponseForbidden
from core.models import Company, Department
from django import forms


@csrf_protect
def login_view(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return redirect("company_list")
        else:
            return render(request, "login.html", {"form": {}, "errors": True})
    return render(request, "login.html", {"form": {}})


def logout_view(request):
    logout(request)
    return redirect("login")


@login_required
def landing(request):
    return redirect("company_list")


# --- Company Management ---
def is_admin_or_manager(user):
    return user.is_authenticated and user.role in ("ADMIN", "MANAGER")


class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ["name"]


class DepartmentForm(forms.ModelForm):
    class Meta:
        model = Department
        fields = ["company", "name"]


@login_required
@user_passes_test(is_admin_or_manager)
def company_list(request):
    return render(request, "company_list.html")


@login_required
@user_passes_test(is_admin_or_manager)
def company_list_partial(request):
    companies = Company.objects.all()
    return render(request, "partials/company_table_body.html", {"companies": companies})


@login_required
@user_passes_test(is_admin_or_manager)
def company_create(request):
    if request.method == "POST":
        form = CompanyForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, "partials/success_marker.html", {"message": "Company saved successfully"})
    else:
        form = CompanyForm()
    return render(request, "temp_modal.html", {"form": form, "action_url": "/companies/create/","form_page":"company_form.html","title":"Add Company Form"})


@login_required
@user_passes_test(is_admin_or_manager)
def company_edit(request, pk):
    company = get_object_or_404(Company, pk=pk)
    if request.method == "POST":
        form = CompanyForm(request.POST, instance=company)
        if form.is_valid():
            form.save()
            return render(request, "partials/success_marker.html", {"message": "Company saved successfully"})
    else:
        form = CompanyForm(instance=company)
    return render(request, "temp_modal.html", {"form": form, "action_url": f"/companies/{pk}/edit/", "form_page": "company_form.html", "title": "Edit Company Form"})


@login_required
@user_passes_test(is_admin_or_manager)
def company_delete(request, pk):
    company = get_object_or_404(Company, pk=pk)
    if request.method == "POST":
        company.delete()
        return HttpResponse("COMPANY_DELETE_SUCCESS")
    return HttpResponseForbidden()


# --- Department Management ---
@login_required
@user_passes_test(is_admin_or_manager)
def department_list(request):
    return render(request, "department_list.html")


@login_required
@user_passes_test(is_admin_or_manager)
def department_list_partial(request):
    departments = Department.objects.select_related("company").all()
    return render(request, "partials/department_table_body.html", {"departments": departments})


@login_required
@user_passes_test(is_admin_or_manager)
def department_create(request):
    companies = Company.objects.all()
    if request.method == "POST":
        form = DepartmentForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse("DEPARTMENT_FORM_SUCCESS")
    else:
        form = DepartmentForm()
    return render(request, "temp_modal.html", {"form": form, "companies": companies, "action_url": "/departments/create/", "form_page": "department_form.html", "title": "Add Department Form"})


@login_required
@user_passes_test(is_admin_or_manager)
def department_edit(request, pk):
    department = get_object_or_404(Department, pk=pk)
    companies = Company.objects.all()
    if request.method == "POST":
        form = DepartmentForm(request.POST, instance=department)
        if form.is_valid():
            form.save()
            return HttpResponse("DEPARTMENT_FORM_SUCCESS")
    else:
        form = DepartmentForm(instance=department)
    return render(request, "temp_modal.html", {"form": form, "companies": companies, "action_url": f"/departments/{pk}/edit/", "form_page": "department_form.html", "title": "Edit Department Form"})


@login_required
@user_passes_test(is_admin_or_manager)
def department_delete(request, pk):
    department = get_object_or_404(Department, pk=pk)
    if request.method == "POST":
        department.delete()
        return HttpResponse("DEPARTMENT_DELETE_SUCCESS")
    return HttpResponseForbidden()


# --- Employee Management ---
from core.models import Employee


class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ["name", "email", "company", "department", "designation", "status", "hired_on", "mobile", "address"]


from django.views.decorators.http import require_GET


@require_GET
@login_required
@user_passes_test(is_admin_or_manager)
def departments_by_company(request):
    company_id = request.GET.get("company_id")
    departments = Department.objects.none()
    if company_id:
        departments = Department.objects.filter(company_id=company_id)
    return render(request, "partials/departments_by_company.html", {"departments": departments})


@login_required
@user_passes_test(is_admin_or_manager)
def employee_list(request):
    return render(request, "employee_list.html")


@login_required
@user_passes_test(is_admin_or_manager)
def employee_list_partial(request):
    employees = Employee.objects.select_related("company", "department").all()
    return render(request, "partials/employee_table_body.html", {"employees": employees})


@login_required
@user_passes_test(is_admin_or_manager)
def employee_create(request):
    companies = Company.objects.all()
    departments = Department.objects.all()
    if request.method == "POST":
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse("EMPLOYEE_FORM_SUCCESS")
    else:
        form = EmployeeForm()
    return render(request, "temp_modal.html", {"form": form, "companies": companies, "departments": departments, "action_url": "/employees/create/", "form_page": "employee_form.html", "title": "Add Employee Form"})


@login_required
@user_passes_test(is_admin_or_manager)
def employee_edit(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    companies = Company.objects.all()
    departments = Department.objects.all()
    if request.method == "POST":
        form = EmployeeForm(request.POST, instance=employee)
        if form.is_valid():
            form.save()
            return HttpResponse("EMPLOYEE_FORM_SUCCESS")
    else:
        form = EmployeeForm(instance=employee)
    return render(request, "temp_modal.html", {"form": form, "companies": companies, "departments": departments, "action_url": f"/employees/{pk}/edit/", "form_page": "employee_form.html", "title": "Edit Employee Form"})


@login_required
@user_passes_test(is_admin_or_manager)
def employee_delete(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == "POST":
        employee.delete()
        return HttpResponse("EMPLOYEE_DELETE_SUCCESS")
    return HttpResponseForbidden()
