from rest_framework import viewsets, permissions, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .models import Company, Department, Employee
from .serializers import CompanySerializer, DepartmentSerializer, EmployeeSerializer
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
    queryset = Company.objects.annotate(
        _num_departments=Count("department", distinct=True),
        _num_employees=Count("employee", distinct=True)
    ).all().order_by('-id')
    serializer_class = CompanySerializer
    permission_classes = [IsAdmin]

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
    queryset = Department.objects.select_related("company").all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsManager | IsAdmin]
    filterset_fields = ["company"]

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
