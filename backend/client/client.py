from .models import *
from .serializers import *

import os, jwt

from datetime import datetime, timedelta

from common.logger import Logger

class ClientClass:
    def get_client_list(request):
        token = bytes(request.GET.get('token'), 'utf-8')
        decode = jwt.decode(token, str(os.getenv('JWT_SECRET')), algorithms=["HS256"])
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
        decode = jwt.decode(token, str(os.getenv('JWT_SECRET')), algorithms=["HS256"])
        
        name = request.data['name']
        phone = int(str(request.data['phone']).replace('-', ''))
        gender = get_text_value(Client.Gender, request.data['gender'])
        birthdate = datetime.strptime(str(request.data['birthdate']).replace('.', '-'), '%Y-%m-%d').date()
        height = round(float(request.data['height']), 2)
        activity = request.data['activityLevel']
        goal = request.data['goal']
        notes = request.data['notes']

        weight = round(float(request.data['weight']), 2)
        skeletal_muscle = round(float(request.data['muscleMass']), 2)
        body_fat = round(float(request.data['bodyFatMass']), 2)
        body_fat_ratio = round(float(request.data['bodyFatPercentage']), 2)
        
        address = request.data['address']
        detailAddress = request.data['detailAddress']
        deliveryMessage = request.data['deliveryMessage']
        entryMethod = request.data['entryMethod']

        if request.data['entryPassword']:
            entryPassword = int(request.data['entryPassword'])
        else:
            entryPassword = 0

        new_client = Client.objects.create(name=name, contact=phone, gender=gender, birth=birthdate, height=height, activity=activity, goal=goal, memo=notes, is_subscribed=False, create_dt=datetime.today(), update_dt=datetime.today(), trainer_id=decode['trainer_id'])
        Body_Data.objects.create(weight=weight, skeletal_muscle=skeletal_muscle, body_fat=body_fat, body_fat_ratio=body_fat_ratio, update_dt=new_client.update_dt, client_id=new_client.client_id)
        Delivery.objects.create(address=address, address_detail=detailAddress, message=deliveryMessage, doorlock=entryPassword, doorlock_type=entryMethod, client_id=new_client.client_id)

    def add_bia(request):
        client_id = request.data['clientId']
        weight = round(float(request.data['weight']), 2)
        skeletal_muscle = round(float(request.data['muscleMass']), 2)
        body_fat = round(float(request.data['bodyFatMass']), 2)
        body_fat_ratio = round(float(request.data['bodyFatPercentage']), 2)

        Body_Data.objects.create(weight=weight, skeletal_muscle=skeletal_muscle, body_fat=body_fat, body_fat_ratio=body_fat_ratio, update_dt=datetime.today(), client_id=client_id)