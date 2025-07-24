from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet,
    DepartmentViewSet,
    EmployeeViewSet,
    EmployeeStatusChoicesView,
    DashboardStatsView,
)
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


router = DefaultRouter()
router.register(r"companies", CompanyViewSet)
router.register(r"departments", DepartmentViewSet)
router.register(r"employees", EmployeeViewSet)

from .views import CustomTokenObtainPairView

urlpatterns = router.urls + [
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "employee-status-choices/",
        EmployeeStatusChoicesView.as_view(),
        name="employee-status-choices",
    ),
    path(
        "dashboard-stats/",
        DashboardStatsView.as_view(),
        name="dashboard-stats",
    ),
]
