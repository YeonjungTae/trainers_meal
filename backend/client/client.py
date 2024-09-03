from .models import *
from .serializers import *

import os, jwt

from datetime import datetime, timedelta

from common.logger import Logger

class ClientClass:
    def get_client_list(request):
        token = bytes(request.GET.get('token'), 'utf-8')
        decode = jwt.decode(token, 'myMGd=JH(yqqo19~ruQ[R)]*xqsK=T|%', algorithms=["HS256"])
        is_subscribed = bool(request.GET.get('filterStatus'))
        keyword = request.GET.get('searchTerm')

        if keyword and is_subscribed:
           client = Client.objects.filter(trainer_id=decode['trainer_id'], is_subscribed=is_subscribed, name__icontains=keyword)

        elif keyword:
            client = Client.objects.filter(trainer_id=decode['trainer_id'], name__icontains=keyword)

        elif is_subscribed:
            client = Client.objects.filter(trainer_id=decode['trainer_id'], is_subscribed=is_subscribed)

        else:
            client = Client.objects.filter(trainer_id=decode['trainer_id'])
        
        return client

    def add_client(request):
        token = bytes(request.data['tokenData'], 'utf-8')
        decode = jwt.decode(token, 'myMGd=JH(yqqo19~ruQ[R)]*xqsK=T|%', algorithms=["HS256"])
        
        name = request.data['name']
        phone = int(str(request.data['phone']).replace('-', ''))
        gender = get_text_value(Client.Gender, request.data['gender'])
        birthdate = datetime.strptime(str(request.data['birthdate']).replace('.', '-'), '%Y-%m-%d').date()
        if request.data['height']:
            height = round(float(request.data['height']), 2)
        else:
            height = float(0)
        activity = request.data['activityLevel']
        goal = request.data['goal']
        notes = request.data['notes']

        new_client = Client.objects.create(name=name, contact=phone, gender=gender, birth=birthdate, height=height, activity=activity, goal=goal, memo=notes, is_subscribed=False, create_dt=datetime.today(), update_dt=datetime.today(), trainer_id=decode['trainer_id'])

        if request.data['weight'] or request.data['muscleMass'] or request.data['bodyFatMass'] or request.data['bodyFatPercentage']:
            if request.data['weight']:
                weight = round(float(request.data['weight']), 2)
            else:
                weight = float(0)
            if request.data['muscleMass']:
                skeletal_muscle = round(float(request.data['muscleMass']), 2)
            else:
                skeletal_muscle = float(0)
            if request.data['bodyFatMass']:
                body_fat = round(float(request.data['bodyFatMass']), 2)
            else:
                body_fat = float(0)
            if request.data['bodyFatPercentage']:
                body_fat_ratio = round(float(request.data['bodyFatPercentage']), 2)
            else:
                body_fat_ratio = float(0)

            Body_Data.objects.create(weight=weight, skeletal_muscle=skeletal_muscle, body_fat=body_fat, body_fat_ratio=body_fat_ratio, update_dt=new_client.update_dt, client_id=new_client.client_id)

        
        if request.data['address'] or request.data['detailAddress'] or request.data['deliveryMessage'] or entryMethod = request.data['entryMethod']:
            if request.data['address']:
                address = request.data['address']
            else:
                address = ''
            if request.data['detailAddress']:
                detailAddress = request.data['detailAddress']
            else:
                detailAddress = ''
            if request.data['deliveryMessage']:
                deliveryMessage = request.data['deliveryMessage']
            else:
                deliveryMessage = 0
            if request.data['entryMethod']:
                entryMethod = request.data['entryMethod']
            else:
                entryMethod = 2
            if request.data['entryPassword']:
                entryPassword = int(request.data['entryPassword'])
            else:
                entryPassword = 0

            Delivery.objects.create(address=address, address_detail=detailAddress, message=deliveryMessage, doorlock=entryPassword, doorlock_type=entryMethod, client_id=new_client.client_id)

    def add_bia(request):
        client_id = request.data['clientId']
        weight = round(float(request.data['weight']), 2)
        skeletal_muscle = round(float(request.data['muscleMass']), 2)
        body_fat = round(float(request.data['bodyFatMass']), 2)
        body_fat_ratio = round(float(request.data['bodyFatPercentage']), 2)

        Body_Data.objects.create(weight=weight, skeletal_muscle=skeletal_muscle, body_fat=body_fat, body_fat_ratio=body_fat_ratio, update_dt=datetime.today(), client_id=client_id)