from rest_framework.views import APIView
from rest_framework.response import Response
from .client import ClientClass
from .serializers import *

import os, json, jwt

from common.logger import Logger

class get_client_list(APIView):
    def get(self, request):
        result = ClientClass.get_client_list(request)

        serializer = ClientSerializer(result, many=True)

        return Response(serializer.data)
    
class get_option_list(APIView):
    def get(self, request):
        data = {
            'activity': get_data_list(Client.Activity),
            'goal': get_data_list(Client.Goal),
        }
        return Response(data)
    
class get_delivery_options(APIView):
    def get(self, request):
        data = {
            'deliveryMessage': get_data_list(Delivery.Message),
            'entryMethod': get_data_list(Delivery.Doorlock_Type)
        }

        return Response(data)

class edit_client(APIView):
    def get(self, request):
        try:
            result = ClientInfoSerializer(request)
            Logger.print_main_log('회원 정보를 불러오는 데에 성공하였습니다.')
            return Response(result)

        except:
            raise ValueError('회원 정보를 불러오는 데에 실패하였습니다.')

    def post(self, request):
        try:
            ClientClass.add_client(request)
            return Response('회원을 추가하는 데에 성공하였습니다.')

        except:
            raise ValueError('회원을 추가하는 데에 실패하였습니다.')
        
    def patch(self, request):
        try:
            ClientClass.update_client(request)
            return Response('회원 정보를 수정하였습니다.')

        except:
            raise ValueError('회원 정보를 수정하는 데에 실패하였습니다.')
        
    def delete(self, request):
        try:
            ClientClass.delete_client(request)
            Logger.print_main_log('회원을 삭제하는 데에 성공하였습니다.')
            return Response('회원 삭제가 완료되었습니다.')

        except:
            raise ValueError('회원을 삭제하는 데에 실패하였습니다.')

# class get_client_info(APIView):
        
class add_bia(APIView):
    def get(self, request):
        try:
            result = BodyInfoSerializer(request.GET.get('client_id'))
            Logger.print_main_log('체성분 데이터를 불러오는 데에 성공하였습니다.')
            return Response(result)
        
        except:
            raise ValueError('체성분 데이터를 추가하는 데에 실패하였습니다.')
    def post(self, request):
        try:
            ClientClass.add_bia(request)
            return Response('체성분 데이터를 추가하는 데에 성공하였습니다.')

        except:
            raise ValueError('체성분 데이터를 추가하는 데에 실패하였습니다.')
        
class get_address_info(APIView):
    def get(self, request):
        try:
            result = AddressInfoSerializer(request.GET.get('client_id'))
            Logger.print_main_log('주소 데이터를 불러오는 데에 성공하였습니다.')
            return Response(result)
        except:
            raise ValueError('주소 데이터를 얻는 데에 실패하였습니다.')
        
    def post(self, request):
        try:
            ClientClass.add_address(request)
            return Response('주소 데이터를 추가하는 데에 성공하였습니다.')
        
        except:
            raise ValueError('주소 데이터를 추가하는 데에 실패하였습니다.')