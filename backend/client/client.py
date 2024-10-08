from .models import *
from .serializers import *

import os, jwt

from datetime import datetime, timedelta

from common.logger import Logger

class ClientClass:
    def get_client_list(request):
        token = bytes(request.GET.get('token'), 'utf-8')
        decode = jwt.decode(token, 'myMGd=JH(yqqo19~ruQ[R)]*xqsK=T|%', algorithms=["HS256"])

        trainer_info = Trainer.objects.get(trainer_id=decode['trainer_id'])

        if trainer_info.is_admin == False:
            client = Client.objects.filter(trainer_id=decode['trainer_id']).order_by('name')
        else:
            gym_id = trainer_info.gym.gym_id
            trainer_list = Trainer.objects.filter(gym_id=gym_id).values_list('trainer_id', flat=True)
            client = Client.objects.filter(trainer_id__in=trainer_list).distinct().order_by('name')

        Logger.print_main_log('고객 목록 조회 완료')
        
        return client

    def add_client(request):
        Logger.print_main_log('고객 추가')
        token = bytes(request.data['tokenData'], 'utf-8')
        decode = jwt.decode(token, 'myMGd=JH(yqqo19~ruQ[R)]*xqsK=T|%', algorithms=["HS256"])
        
        name = request.data['name']
        phone = request.data['phone']
        gender = get_text_value(Client.Gender, request.data['gender'])
        birthdate = datetime.strptime(str(request.data['birthdate']).replace('.', '-'), '%Y-%m-%d').date()
        activity = request.data['activityLevel']
        goal = request.data['goal']
        try:
            notes = request.data['notes']
        except:
            notes = ''
        update_dt = datetime.today()

        new_client = Client.objects.create(
            name=name, 
            contact=phone, 
            gender=gender, 
            birth=birthdate,  
            activity=activity, 
            goal=goal, 
            memo=notes, 
            is_subscribed=False, 
            create_dt=update_dt, 
            update_dt=update_dt, 
            trainer_id=decode['trainer_id'])
        
        Logger.print_log('고객 추가 완료')

        print(request.data)
        try:
            if request.data['muscleMass']:
                skeletal_muscle = request.data['muscleMass']
        except:
            skeletal_muscle = 0
        try:
            if request.data['bodyFatMass']:
                body_fat = request.data['bodyFatMass']
        except:
            body_fat = 0
        try:
            if request.data['bodyFatPercentage']:
                body_fat_ratio = request.data['bodyFatPercentage']
        except:
            body_fat_ratio = 0

        ClientClass.add_bia(**{'client_id': new_client.client_id, 
                                'height': request.data['height'], 
                                'weight': request.data['weight'], 
                                'skeletal_muscle': skeletal_muscle, 
                                'body_fat': body_fat, 
                                'body_fat_ratio': body_fat_ratio})

        try:
            if request.data['address']:
                address = request.data['address']
        except:
            address = ''
        try:
            if request.data['detailAddress']:
                detailAddress = request.data['detailAddress']
        except:
            detailAddress = ''
        try:
            if request.data['deliveryMessage']:
                deliveryMessage = get_text_value(Delivery.Message, request.data['deliveryMessage'])
        except:
            deliveryMessage = 0

        try:
            if request.data['customDeliveryMessage']:
                customDeliveryMessage = request.data['customDeliveryMessage']
        except:
            customDeliveryMessage = ''
        try:
            if request.data['entryMethod']:
                entryMethod = request.data['entryMethod']
        except:
            entryMethod = 2
        try:
            if request.data['entryPassword']:
                entryPassword = int(request.data['entryPassword'])
        except:
            entryPassword = 0

        if address != '':
            Delivery.objects.create(
                address=address, 
                address_detail=detailAddress, 
                message=deliveryMessage,
                message_detail=customDeliveryMessage,
                doorlock=entryPassword, 
                doorlock_type=entryMethod, 
                client_id=new_client.client_id, 
                update_dt=new_client.update_dt)
            
            Logger.print_log('주소 정보 입력 완료')

    def update_client(request):
        Logger.print_main_log('고객 정보 업데이트 시작')
        print(request.data)
        section = request.data.get('section')
        client_id = request.data.get('client_id')
        update_dt = datetime.today()

        if section == 'personal':
            name = request.data.get('name')
            phone = request.data.get('phone')
            gender = get_text_value(Client.Gender, request.data.get('gender'))
            birthdate = datetime.strptime(str(request.data.get('birthdate')).replace('.', '-'), '%Y-%m-%d').date()

            Client.objects.filter(client_id=client_id).update(
                name=name,
                contact=phone,
                gender=gender,
                birth=birthdate,
                update_dt=update_dt
            )

            Logger.print_log('고객 정보 업데이트 끝')

        elif section == 'physical':
            ClientClass.add_bia(**{'client_id': client_id, 
                                   'height': request.data.get('height'), 
                                   'weight': request.data.get('weight'), 
                                   'skeletal_muscle': request.data.get('muscleMass'), 
                                   'body_fat': request.data.get('bodyFatMass'), 
                                   'body_fat_ratio': request.data.get('bodyFatPercentage')})
        
        elif section == 'goal':
            activity = request.data.get('activityLevel')
            goal = request.data.get('goal')
            memo = request.data.get('memo')

            Client.objects.filter(client_id=client_id).update(
                activity=activity,
                goal=goal,
                memo=memo,
                update_dt=update_dt
            )

            Logger.print_log('고객 목표 정보 및 메모 업데이트 끝')

        else:
            ClientClass.add_address(**{'client_id': client_id, 
                            'address': request.data.get('address'), 
                            'address_detail': request.data.get('detailAddress'), 
                            'message': request.data.get('deliveryMessage'),
                            'message_detail': request.data.get('customDeliveryMessage'),
                            'doorlock_type': request.data.get('entryMethod'), 
                            'doorlock': request.data.get('entryPassword')})

            
    def delete_client(request):
        Logger.print_main_log('고객 삭제')
        client_id = request.GET.get('client_id')
        Logger.print_log('고객 ID:', client_id)
        Body_Data.objects.filter(client_id=client_id).delete()
        Delivery.objects.filter(client_id=client_id).delete()
        Client.objects.filter(client_id=client_id).delete()

    def add_bia(**kwargs):
        Logger.print_main_log('고객 신체 정보 입력')
        update_dt = datetime.today()
        if kwargs.get('height'):
            height = round(float(kwargs.get('height')), 2)
        else:
            height = float(0)
        if kwargs.get('weight'):
            weight = round(float(kwargs.get('weight')), 2)
        else:
            weight = float(0)

        if kwargs.get('skeletal_muscle'):
            skeletal_muscle = round(float(kwargs.get('skeletal_muscle')), 2)
        else:
            skeletal_muscle = float(0)
        
        if kwargs.get('body_fat'):
            body_fat = round(float(kwargs.get('body_fat')), 2)
        else:
            body_fat = float(0)

        if kwargs.get('body_fat_ratio'):
            body_fat_ratio = round(float(kwargs.get('body_fat_ratio')), 2)
        else:
            body_fat_ratio = float(0)

        Body_Data.objects.create(
            height=height,
            weight=weight, 
            skeletal_muscle=skeletal_muscle, 
            body_fat=body_fat, 
            body_fat_ratio=body_fat_ratio, 
            update_dt=update_dt, 
            client_id=kwargs.get('client_id'))
        
        Logger.print_log('고객 신체 정보 업데이트 끝')

    def add_address(**kwargs):
        Logger.print_main_log('고객 신체 정보 입력')
        print(kwargs)
        update_dt = datetime.today()

        if kwargs.get('address'):
            address = kwargs.get('address')
        else:
            address = ''
        if kwargs.get('address_detail'):
            address_detail = kwargs.get('address_detail')
        else:
            address_detail = ''
        if kwargs.get('message') != '':
            print(kwargs.get('message'))
            try:
                message = get_text_value(Delivery.Message, kwargs.get('message'))
            except:
                message = kwargs.get('message')
        else:
            message = 0
        if kwargs.get('message_detail') != '':
            message_detail = kwargs.get('message_detail')
        else:
            message_detail = ''
        if kwargs.get('doorlock_type'):
            doorlock_type = kwargs.get('doorlock_type')
        else:
            doorlock_type = 2
        if kwargs.get('doorlock'):
            doorlock = int(kwargs.get('doorlock'))
        else:
            doorlock = 0

        if Delivery.objects.filter(client_id=kwargs.get('client_id')).exists():
            Delivery.objects.filter(client_id=kwargs.get('client_id')).update(
                address=address, 
                address_detail=address_detail, 
                message=message, 
                message_detail=message_detail,
                doorlock=doorlock, 
                doorlock_type=doorlock_type, 
                update_dt=update_dt
            )
            Logger.print_log('고객 주문 정보 업데이트 끝')
        else:
            Delivery.objects.create(
                address=address, 
                address_detail=address_detail, 
                message=message,
                message_detail=message_detail,
                doorlock=doorlock, 
                doorlock_type=doorlock_type, 
                client_id=kwargs.get('client_id'), 
                update_dt=update_dt
            )
            Logger.print_log('고객 주문 정보 생성 끝')

        Client.objects.filter(client_id=kwargs.get('client_id')).update(update_dt=update_dt)
