import json
from collections import OrderedDict
from django.db import models
from rest_framework import serializers

from .models import *

def get_data_list(TABLE_NAME):
    result = list()
    for data in TABLE_NAME:
        result.append({'index': TABLE_NAME(data), 'data': TABLE_NAME(data).label})
    
    return result

def get_text_value(TABLE_NAME, val):
    for data in TABLE_NAME:
        if TABLE_NAME(data).label in val:
            result = data

    return result

def get_label(TABLE_NAME, val):
    for data in TABLE_NAME:
        if data == val:
            result = data.label
    return result

class ClientSerializer(serializers.ModelSerializer):
    goal = serializers.CharField(source='get_goal_display')
    
    class Meta:
        fields = (
            'client_id',
            'is_subscribed',
            'name',
            'gender',
            'goal'
        )
        model = Client

class Body_DataSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Body_Data


class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Delivery

def ClientInfoSerializer(request):
    client_id = request.GET.get('client_id')
    section = request.GET.get('section')
    client = Client.objects.get(client_id=client_id)

    result = OrderedDict()
    result['client_id'] = client_id
    result['name'] = client.name
    result['phone'] = client.contact
    result['gender'] = get_label(Client.Gender, client.gender)
    result['birthdate'] = str(client.birth)
    result['memo'] = str(client.memo)
    if section == 'goal':
        result['activityLevel'] = client.activity
        result['goal'] = client.goal
    else:
        result['activityLevel'] = get_label(Client.Activity, client.activity)
        result['goal'] = get_label(Client.Goal, client.goal)

    if Delivery.objects.filter(client_id=client_id).exists():
        delivery = Delivery.objects.get(client_id=client_id)

        result['address'] = delivery.address
        result['detailAddress'] = delivery.address_detail
        if section == 'delivery':
            result['deliveryMessage'] = delivery.message
            result['entryMethod'] = delivery.doorlock_type
        else:
            result['deliveryMessage'] = get_label(Delivery.Message, delivery.message)
            result['entryMethod'] = get_label(Delivery.Doorlock_Type, delivery.doorlock_type)
        if delivery.doorlock == 0:
            delivery.doorlock = ''
        result['entryPassword'] = delivery.doorlock
    else:
        result['address'] = ''
        result['detailAddress'] = ''
        result['deliveryMessage'] = ''
        result['entryMethod'] = ''
        result['entryPassword'] = ''

    if Body_Data.objects.filter(client_id=client_id).exists():
        body_data = Body_Data.objects.filter(client_id=client_id).order_by('-update_dt').first()
        result['height'] = str(body_data.height)
        result['weight'] = str(body_data.weight)
        result['muscleMass'] = str(body_data.skeletal_muscle)
        result['bodyFatMass'] = str(body_data.body_fat)
        result['bodyFatPercentage'] = str(body_data.body_fat_ratio)
    else:
        result['height'] = str(0)
        result['weight'] = str(0)
        result['muscleMass'] = str(0)
        result['bodyFatMass'] = str(0)
        result['bodyFatPercentage'] = str(0)

    return json.dumps(result, ensure_ascii=False, indent=2)

def BodyInfoSerializer(client_id):
    result = OrderedDict()
    if Body_Data.objects.filter(client=client_id).exists():
        body_data = Body_Data.objects.filter(client=client_id).order_by('-update_dt').first()

        result['height'] = str(body_data.height)
        result['weight'] = str(body_data.weight)
        result['muscleMass'] = str(body_data.skeletal_muscle)
        result['bodyFatMass'] = str(body_data.body_fat)
        result['bodyFatPercentage'] = str(body_data.body_fat_ratio)
    else:
        result['height'] = str(0)
        result['weight'] = str(0)
        result['muscleMass'] = str(0)
        result['bodyFatMass'] = str(0)
        result['bodyFatPercentage'] = str(0)

    return json.dumps(result, ensure_ascii=False, indent=2)

def AddressInfoSerializer(client_id):
    result = OrderedDict()
    if Delivery.objects.filter(client=client_id).exists():
        delivery_data = Delivery.objects.filter(client=client_id).order_by('-update_dt').first()

        result['address'] = str(delivery_data.address)
        result['detailAddress'] = str(delivery_data.address_detail)
        result['deliveryMessage'] = str(delivery_data.message)
        result['entryMethod'] = delivery_data.doorlock_type
        if delivery_data.doorlock == 0:
            delivery_data.doorlock = ''
        result['entryPassword'] = delivery_data.doorlock

    return json.dumps(result, ensure_ascii=False, indent=2)