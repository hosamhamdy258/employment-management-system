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

    def validate(self, data):
        # Case-insensitive uniqueness validation for department name within a company.
        name = data.get('name')
        company = data.get('company')
        if name and company:
            queryset = Department.objects.filter(company=company, name__iexact=name)
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError({
                    'name': 'A department with this name already exists in this company.'
                })
        return data


class EmployeeSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)
    days_employed = serializers.IntegerField(read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'

    def validate(self, data):
        # Case-insensitive uniqueness validation for employee name within a department.
        name = data.get('name')
        department = data.get('department')
        if name and department:
            queryset = Employee.objects.filter(department=department, name__iexact=name)
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError({
                    'name': 'An employee with this name already exists in this department.'
                })
        return data


class EmployeeNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'name', 'department_name', 'hired_on')
    
    department_name = serializers.CharField(source='department.name', read_only=True)


class DepartmentDetailSerializer(DepartmentSerializer):
    employees = EmployeeNestedSerializer(many=True, read_only=True, source='employee_set')

    class Meta(DepartmentSerializer.Meta):
        fields = list(DepartmentSerializer.Meta.fields) + ['employees']


class CompanyDetailSerializer(CompanySerializer):
    departments = DepartmentDetailSerializer(many=True, read_only=True, source='department_set')

    class Meta(CompanySerializer.Meta):
        fields = list(CompanySerializer.Meta.fields) + ['departments']


