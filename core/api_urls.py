from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, DepartmentViewSet, EmployeeViewSet
from django.urls import path, include



router = DefaultRouter()
router.register(r"companies", CompanyViewSet)
router.register(r"departments", DepartmentViewSet)
router.register(r"employees", EmployeeViewSet)

from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = router.urls + [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
