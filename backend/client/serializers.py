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

def ClientInfoSerializer(client_id):
    client = Client.objects.get(client_id=client_id)
    delivery = Delivery.objects.get(client=client_id)
    body_data = Body_Data.objects.filter(client=client_id).order_by('-update_dt').first()

    result = OrderedDict()
    result['client_id'] = client_id
    result['name'] = client.name
    result['gender'] = get_label(Client.Gender, client.gender)
    result['birthdate'] = str(client.birth)
    result['height'] = str(client.height)
    result['weight'] = str(body_data.weight)
    result['muscleMass'] = str(body_data.skeletal_muscle)
    result['bodyFatMass'] = str(body_data.body_fat)
    result['bodyFatPercentage'] = str(body_data.body_fat_ratio)
    result['activityLevel'] = get_label(Client.Activity, client.activity)
    result['goal'] = get_label(Client.Goal, client.goal)
    result['address'] = delivery.address
    result['detailAddress'] = delivery.address_detail
    result['deliveryMessage'] = get_label(Delivery.Message, delivery.message)
    result['entryMethod'] = get_label(Delivery.Doorlock_Type, delivery.doorlock_type)
    if delivery.doorlock == 0:
        delivery.doorlock = ''
    result['entryPassword'] = delivery.doorlock

    return json.dumps(result, ensure_ascii=False, indent=2)