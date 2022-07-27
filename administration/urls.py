from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from . import api

router = DefaultRouter()
router.register(r'ProductTreeBase', api.ParentProduct, basename="base_product_tree")


urlpatterns = [
    path('base/', views.BasePage.as_view()),
    path('productTree/', views.ProductTree.as_view()),
    path('saveProductTree/', api.SaveProductTree.as_view()),
    path('ChildrenModel/<str:pk>/', api.ChildrenElements.as_view()),
    path('DeleteProductTree/', api.DeleteProductTree.as_view()),
    path('SearchQuery/<str:query>/<str:pk>/', api.SearchProductTree.as_view())
]
urlpatterns += router.urls