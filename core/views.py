from rest_framework import viewsets, permissions, views, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .models import Company, Department, Employee
from .serializers import (
    CompanySerializer, DepartmentSerializer, EmployeeSerializer, CompanyDetailSerializer, DepartmentDetailSerializer,
)
from .permissions import IsAdmin, IsManager, IsEmployee

# --- Custom JWT Login View ---
from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt_serializers import CustomTokenObtainPairSerializer


from rest_framework.permissions import AllowAny


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


from django.db.models import Count


class CompanyViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'retrieve':
            # Prefetch related departments and their employees to prevent N+1 queries
            return queryset.prefetch_related('department_set__employee_set')
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CompanyDetailSerializer
        return CompanySerializer
    
    queryset = Company.objects.annotate(
        _num_departments=Count("department", distinct=True),
        _num_employees=Count("employee", distinct=True)
    ).order_by("-id")
    serializer_class = CompanySerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve', 'all']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["get"])
    def all(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DepartmentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'retrieve':
            # Prefetch related employees to prevent N+1 queries
            return queryset.prefetch_related('employee_set')
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DepartmentDetailSerializer
        return DepartmentSerializer

    queryset = Department.objects.select_related("company").all()
    serializer_class = DepartmentSerializer
    filterset_fields = ["company"]

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve', 'all']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsManager | IsAdmin]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["get"])
    def all(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        try:
            instance = serializer.save()
            instance.full_clean()  # This calls the model's clean() method
        except ValidationError as e:
            # Convert Django ValidationError to DRF ValidationError
            from rest_framework.exceptions import ValidationError as DRFValidationError

            if hasattr(e, "message_dict"):
                raise DRFValidationError(e.message_dict)
            else:
                raise DRFValidationError({"detail": str(e)})


class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsManager]
    queryset = Employee.objects.select_related("company", "department").all()
    serializer_class = EmployeeSerializer

    @action(detail=False, methods=["get"])
    def all(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class EmployeeStatusChoicesView(views.APIView):
    def get(self, request, *args, **kwargs):
        choices = Employee.Status.choices
        return Response([{"value": choice[0], "label": choice[1]} for choice in choices])

    permission_classes = [IsEmployee | IsManager | IsAdmin]





class DashboardStatsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Aggregate data for stats cards
        company_count = Company.objects.count()
        department_count = Department.objects.count()
        employee_count = Employee.objects.count()

        # Aggregate data for charts
        employees_per_company = Company.objects.annotate(
            employee_count=Count('employee')).filter(employee_count__gt=0).values('name', 'employee_count')

        departments_per_company = Company.objects.annotate(
            department_count=Count('department')).filter(department_count__gt=0).values('name', 'department_count')

        # Combine all data into a single response
        response_data = {
            'stats': {
                'companies': company_count,
                'departments': department_count,
                'employees': employee_count,
            },
            'chart_data': {
                'employees_per_company': list(employees_per_company),
                'departments_per_company': list(departments_per_company),
            }
        }
        return Response(response_data)
