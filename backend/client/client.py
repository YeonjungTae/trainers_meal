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
            client = Client.objects.filter(trainer_id__in=trainer_list).order_by('name')
        
        return client

    def add_client(request):
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

        if request.data['height']:
            height = round(float(request.data['height']), 2)
        else:
            height = float(0)
        if request.data['weight']:
            weight = round(float(request.data['weight']), 2)
        else:
            weight = float(0)
        try:
            if request.data['muscleMass']:
                skeletal_muscle = round(float(request.data['muscleMass']), 2)
        except:
            skeletal_muscle = float(0)
        
        try:
            if request.data['bodyFatMass']:
                body_fat = round(float(request.data['bodyFatMass']), 2)
        except:
            body_fat = float(0)
        try:
            if request.data['bodyFatPercentage']:
                body_fat_ratio = round(float(request.data['bodyFatPercentage']), 2)
        except:
            body_fat_ratio = float(0)

        Body_Data.objects.create(
            height=height,
            weight=weight, 
            skeletal_muscle=skeletal_muscle, 
            body_fat=body_fat, 
            body_fat_ratio=body_fat_ratio, 
            update_dt=new_client.update_dt, 
            client_id=new_client.client_id)

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
                deliveryMessage = request.data['deliveryMessage']
        except:
            deliveryMessage = 0
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
                doorlock=entryPassword, 
                doorlock_type=entryMethod, 
                client_id=new_client.client_id, 
                update_dt=new_client.update_dt)

    def update_client(request):
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

        elif section == 'physical':
            if request.data.get('height'):
                height = round(float(request.data.get('height')), 2)
            else:
                height = float(0)
            if request.data.get('weight'):
                weight = round(float(request.data.get('weight')), 2)
            else:
                weight = float(0)
            try:
                if request.data.get('muscleMass'):
                    skeletal_muscle = round(float(request.data.get('muscleMass')), 2)
            except:
                skeletal_muscle = float(0)
            
            try:
                if request.data.get('bodyFatMass'):
                    body_fat = round(float(request.data.get('bodyFatMass')), 2)
            except:
                body_fat = float(0)
            try:
                if request.data.get('bodyFatPercentage'):
                    body_fat_ratio = round(float(request.data.get('bodyFatPercentage')), 2)
            except:
                body_fat_ratio = float(0)

            Body_Data.objects.create(
                height=height,
                weight=weight, 
                skeletal_muscle=skeletal_muscle, 
                body_fat=body_fat, 
                body_fat_ratio=body_fat_ratio, 
                update_dt=update_dt, 
                client_id=client_id)
        
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

        else:
            if request.data.get('address'):
                address = request.data.get('address')
            else:
                address = ''
            if request.data.get('detailAddress'):
                detailAddress = request.data.get('detailAddress')
            else:
                detailAddress = ''
            if request.data.get('deliveryMessage') != 'N':
                deliveryMessage = request.data.get('deliveryMessage')
            else:
                deliveryMessage = 0
            if request.data.get('entryMethod'):
                entryMethod = request.data.get('entryMethod')
            else:
                entryMethod = 2
            if request.data.get('entryPassword'):
                entryPassword = int(request.data.get('entryPassword'))
            else:
                entryPassword = 0

            if Delivery.objects.filter(client_id=client_id).exists():
                Delivery.objects.filter(client_id=client_id).update(
                    address=address, 
                    address_detail=detailAddress, 
                    message=deliveryMessage, 
                    doorlock=entryPassword, 
                    doorlock_type=entryMethod, 
                    update_dt=update_dt
                )
            else:
                Delivery.objects.create(
                    address=address, 
                    address_detail=detailAddress, 
                    message=deliveryMessage, 
                    doorlock=entryPassword, 
                    doorlock_type=entryMethod, 
                    client_id=client_id, 
                    update_dt=update_dt
                )

            
    def delete_client(request):
        client_id = request.GET.get('client_id')
        Body_Data.objects.filter(client_id=client_id).delete()
        Delivery.objects.filter(client_id=client_id).delete()
        Client.objects.filter(client_id=client_id).delete()

    def add_bia(request):
        client_id = request.data['clientId']
        height = float(Body_Data.objects.filter(client_id=client_id).latest('height').height)
        weight = round(float(request.data['weight']), 2)
        skeletal_muscle = round(float(request.data['muscleMass']), 2)
        body_fat = round(float(request.data['bodyFatMass']), 2)
        body_fat_ratio = round(float(request.data['bodyFatPercentage']), 2)
        update_dt = datetime.today()

        Body_Data.objects.create(
            height=height,
            weight=weight, 
            skeletal_muscle=skeletal_muscle, 
            body_fat=body_fat, 
            body_fat_ratio=body_fat_ratio, 
            update_dt=update_dt, 
            client_id=client_id)
        Client.objects.filter(client_id=client_id).update(update_dt=update_dt)

    def add_address(request):
        client_id = request.data['clientId']
        address = request.data['address']
        detailAddress = request.data['detailAddress']
        deliveryMessage = request.data['deliveryMessage']
        entryMethod = request.data['entryMethod']
        if request.data['entryPassword'] == '':
            entryPassword = 0
        else:
            entryPassword = request.data['entryPassword']
        update_dt = datetime.today()
        
        Delivery.objects.filter(client_id=client_id).update(
            address=address, 
            address_detail=detailAddress, 
            message=deliveryMessage, 
            doorlock_type=entryMethod, 
            doorlock=entryPassword, 
            update_dt=update_dt)
        Client.objects.filter(client_id=client_id).update(update_dt=update_dt)
