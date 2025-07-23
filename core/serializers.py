from rest_framework import serializers
from .models import Company, Department, Employee


class CompanySerializer(serializers.ModelSerializer):
    num_departments = serializers.IntegerField(read_only=True)
    num_employees = serializers.IntegerField(read_only=True)

    class Meta:
        model = Company
        fields = ["id", "name", "num_departments", "num_employees"]
    
    def get_num_departments(self, obj):
        return getattr(obj, '_num_departments', None) or obj.num_departments
    
    def get_num_employees(self, obj):
        return getattr(obj, '_num_employees', None) or obj.num_employees


class DepartmentSerializer(serializers.ModelSerializer):
    num_employees = serializers.IntegerField(read_only=True)
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model = Department
        fields = ["id", "company", "company_name", "name", "num_employees"]


class EmployeeSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)
    days_employed = serializers.IntegerField(read_only=True)

    class Meta:
        model = Employee
        fields = ["id", "company", "company_name", "department", "department_name", "status", "name", "email", "mobile", "address", "designation", "hired_on", "days_employed"]
