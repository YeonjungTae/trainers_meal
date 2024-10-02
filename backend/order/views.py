from rest_framework.views import APIView
from rest_framework.response import Response
from .order import OrderClass
from .serializers import *

import os, json, jwt

from common.logger import Logger

class get_meal_list(APIView):
    def get(self, request):
        result = OrderClass.get_option_list(request)

        serializer = MealSerializer(result, many=True)

        return Response(serializer.data)
    
    def post(self, request):
        try:
            OrderClass.add_meal_info(request)
            return Response('식단 정보를 추가하는 데에 성공하였습니다.')

        except:
            raise ValueError('식단 정보를 추가하는 데에 실패하였습니다.')
        
class order_register(APIView):
    def get(self, request):
        result = OrderClass.get_meal_list(request)

        return Response(result)
    
    def post(self, request):
        try:
            OrderClass.submit_order(request)
            return Response('주문 정보를 추가하는 데에 성공하였습니다.')

        except:
            raise ValueError('주문 정보를 추가하는 데에 실패하였습니다.')
    
class order_option(APIView):
    def get(self, request):
        result = OrderClass.get_order_option(request)

        return Response(result)
    
    def post(self, request):
        try:
            OrderClass.edit_order_list(request)
            return Response('식단 정보를 추가하는 데에 성공하였습니다.')

        except:
            raise ValueError('식단 정보를 추가하는 데에 실패하였습니다.')
    
class confirm_payment(APIView):
    def post(self, request):
        try: 
            OrderClass.submit_order(request)
            return Response('결제가 성공적으로 이루어졌습니다.')

        except:
            raise ValueError('결제 실패하였습니다.')  