from django.db import models
from rest_framework import serializers
from collections import OrderedDict
import uuid, json

from .models import *

def get_data_list(TABLE_NAME):
    result = list()
    for data in TABLE_NAME:
        result.append(TABLE_NAME(data).label)

    return result

def get_text_value(TABLE_NAME, val):
    for data in TABLE_NAME:
        if TABLE_NAME(data).label in val:
            result = data

class MealSerializer(serializers.ModelSerializer):    
    class Meta:
        fields = (
            'meal_id',
            'group'
        )
        model = Meal

def RegularPaySerializer(client_id):
    result = OrderedDict()

    result['clientKey'] = 'live_gck_Z1aOwX7K8myOK7pQMNXQ8yQxzvNP'
    result['customerKey'] = str(uuid.uuid4())
    result['orderId'] = str(uuid.uuid4())

    client_data = Client.objects.get(client_id=client_id)
    result['name'] = client_data.name
    result['phone'] = '0' + str(client_data.contact)

    return json.dumps(result, ensure_ascii=False, indent=2)

# class Body_DataSerializer(serializers.ModelSerializer):
#     class Meta:
#         fields = '__all__'
#         model = Body_Data


# class DeliverySerializer(serializers.ModelSerializer):
#     class Meta:
#         fields = '__all__'
#         model = Delivery