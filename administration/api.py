from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ProductTrees
from rest_framework import viewsets
from .serializers import ProductTreeSer
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class SearchProductTree(APIView):
    permission_classes = [IsAuthenticated]

    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request, query, pk, *args, **kwargs):
        query_set = ''
        if pk == 'parent':
            query_set = ProductTrees.objects.filter(product__icontains=query, parent=None)
        else:
            pk = int(pk)
            try:
                query_set = ProductTrees.objects.filter(parent__id=pk, product__icontains=query)
            except ObjectDoesNotExist:
                pass
        query_set = ProductTreeSer(query_set, many=True)
        return Response(query_set.data)


class DeleteProductTree(APIView):
    permission_classes = [IsAdminUser]

    @classmethod
    def get_extra_actions(cls):
        return []

    def post(self, request, *args, **kwargs):
        pk = int(request.data.get('primary_key'))
        try:
            obj = ProductTrees.objects.get(id=pk)
            obj.delete()
        except:
            pass
        return Response({})


class ChildrenElements(APIView):
    permission_classes = [IsAuthenticated]

    @classmethod
    def get_extra_actions(cls):
        return []

    def get(self, request, pk, *args, **kwargs):
        pk = int(pk)
        try:
            current_object = ProductTrees.objects.get(id=pk)
            current_object_id = int(current_object.id)
            return Response(get_product_tree_child(current_object_id))
        except ObjectDoesNotExist:
            return Response({})


def get_product_tree_child(current_object_id):
    query = ProductTrees.objects.all()
    child = ProductTrees.objects.none()

    for i in query:
        if i.parent is not None:
            loop_parent = int(i.parent.id)
            if loop_parent == current_object_id:
                children_elements = ProductTrees.objects.filter(id=int(i.id))
                child |= children_elements

    ser = ProductTreeSer(child, many=True)
    return ser.data


class SaveProductTree(APIView):
    permission_classes = [IsAuthenticated]

    @classmethod
    def get_extra_actions(cls):
        return []

    def post(self, request, *args, **kwargs):
        name = request.data.get('name')
        pk = request.data.get('pk')
        try:
            pk = int(pk)
            parent = ProductTrees.objects.get(id=pk)
            ProductTrees.objects.create(product=name, parent=parent)
            # fetch children of pk
            child = get_product_tree_child(pk)
            return Response(child)
        except TypeError:
            ProductTrees.objects.create(product=name)
        return Response({})


class GetObjectByChildren(APIView):
    @classmethod
    def get_extra_actions(cls):
        return []


class ParentProduct(viewsets.ModelViewSet):
    serializer_class = ProductTreeSer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ProductTrees.objects.all()
        for i in queryset:
            if i.parent is not None:
                queryset = queryset.exclude(id=int(i.id))

        return queryset
