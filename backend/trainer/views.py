from rest_framework.views import APIView
from rest_framework.response import Response
from .trainer import TrainerClass
from .serializers import *

import os, jwt
from datetime import datetime, timezone, timedelta

from common.logger import Logger

class check_token(APIView):
    def get(self, request):
        Logger.print_main_log('CHECK TOKEN')
        try:
            token = bytes(request.GET.get('token'), 'utf-8')
            decode = jwt.decode(token, 'myMGd=JH(yqqo19~ruQ[R)]*xqsK=T|%', algorithms=["HS256"])
            print(decode)
            return Response('토큰 인증이 완료되었습니다.')
            
        except jwt.ExpiredSignatureError:
            Logger.print_log('TOKEN EXPIRED')
            raise ValueError('토큰이 만료되었습니다.')

        except:
            raise ValueError('존재하지 않는 토큰입니다.')

class gym_list(APIView):
    def get(self, request):
        result = TrainerClass.get_gym_list()

        serializer = GymSerializer(result, many=True)

        return Response(serializer.data)

class login(APIView):    
    def post(self, request):
        Logger.print_main_log('Logging In...')
        result = TrainerClass.login(**{'username': request.data['username'], 'password': request.data['password']})

        if type(result) is str:
            return Response(result)

        try:
            auto_login = bool(request.data['autoLogin'])
    
            if auto_login == True:
                Logger.print_log('자동 로그인 체크!')
                exp_time = timedelta(days=7)
            else:
                Logger.print_log('자동 로그인 X')
                exp_time = timedelta(hours=18)
            
            token = jwt.encode({"exp": datetime.now(timezone(timedelta(hours=9))) + exp_time, "trainer_id": str(result.trainer_id), "username": result.username, "name": result.name, "is_approved": result.is_approved, "gym_id": str(result.gym_id)}, 'myMGd=JH(yqqo19~ruQ[R)]*xqsK=T|%', algorithm="HS256")
            user = LoginInfoSerializer(result)
            profile = TrainerClass.get_profile_img(**{'trainer': result})

            result = {
                'token': token,
                'user': user.data,
                'gym': result.gym.name,
                'profile': profile,
            }

            return Response(result)

        except:
            Logger.print_error('전송된 값을 확인해 주세요.')
            raise ValueError('전송된 값을 확인해 주세요.')

class register(APIView):
    def get(self, request):
        Flag = TrainerClass.check_id(**{'username': request.GET.get('username')})

        return Response(Flag)
    
    def post(self, request):
        try:
            TrainerClass.register(**{'username': request.data['username'], 'password': request.data['password'], 'name': request.data['name'], 'email': request.data['email'], 'gym': request.data['selectedGym']})
            return Response('트레이너 등록이 완료되었습니다.')
            
        except:
            raise ValueError('트레이너 등록에 실패하였습니다.')
            
class forgot_password(APIView):
    def get(self, request):
        auth_code = TrainerClass.get_authcode(**{'username': request.GET.get('username'), 'name': request.GET.get('name').encode('cp949').decode('euc-kr')})

        return Response(auth_code)

    def post(self, request):
        try:
            TrainerClass.change_password(**{'username': request.data['username'], 'name': request.data['name'].encode('cp949').decode('euc-kr'), 'password': request.data['password']})
            return Response('비밀번호 변경에 성공하였습니다.')

        except:
            raise ValueError('비밀번호 변경에 실패하였습니다.')

class forgot_username(APIView):
    def get(self, request):
        TrainerClass.get_username(**{'email': request.GET.get('email'), 'name': request.GET.get('name').encode('cp949').decode('euc-kr')})

        return Response('등록된 이메일로 정보를 전송했습니다.')