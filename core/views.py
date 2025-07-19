from rest_framework import viewsets, permissions
from .models import Company, Department, Employee
from .serializers import CompanySerializer, DepartmentSerializer, EmployeeSerializer
from .permissions import IsAdmin, IsManager, IsEmployee


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAdmin]


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsManager | IsAdmin]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsEmployee | IsManager | IsAdmin]
