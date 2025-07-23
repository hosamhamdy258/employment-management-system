"""
URL configuration for employee_mgmt project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Employee Management System API",
        default_version="v1",
        description="API documentation for EMS",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

from core import frontend_views

urlpatterns = [
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("admin/", admin.site.urls),
    path("", include("accounts.urls")),
    path("api/", include("core.api_urls")),
    path("", frontend_views.landing, name="landing"),
    # Company management
    path("companies/", frontend_views.company_list, name="company_list"),
    path("companies/list/", frontend_views.company_list_partial, name="company_list_partial"),
    path("companies/create/", frontend_views.company_create, name="company_create"),
    path("companies/<int:pk>/edit/", frontend_views.company_edit, name="company_edit"),
    path("companies/<int:pk>/delete/", frontend_views.company_delete, name="company_delete"),
    # Department management
    path("departments/", frontend_views.department_list, name="department_list"),
    path("departments/list/", frontend_views.department_list_partial, name="department_list_partial"),
    path("departments/create/", frontend_views.department_create, name="department_create"),
    path("departments/<int:pk>/edit/", frontend_views.department_edit, name="department_edit"),
    path("departments/<int:pk>/delete/", frontend_views.department_delete, name="department_delete"),
    # Employee management
    path("employees/", frontend_views.employee_list, name="employee_list"),
    path("employees/list/", frontend_views.employee_list_partial, name="employee_list_partial"),
    path("employees/create/", frontend_views.employee_create, name="employee_create"),
    path("employees/<int:pk>/edit/", frontend_views.employee_edit, name="employee_edit"),
    path("employees/<int:pk>/delete/", frontend_views.employee_delete, name="employee_delete"),
    # HTMX endpoint for dynamic department dropdown
    path("departments/by_company/", frontend_views.departments_by_company, name="departments_by_company"),
]
