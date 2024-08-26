from django.db import models
from rest_framework import serializers
from collections import OrderedDict

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

# class Body_DataSerializer(serializers.ModelSerializer):
#     class Meta:
#         fields = '__all__'
#         model = Body_Data


# class DeliverySerializer(serializers.ModelSerializer):
#     class Meta:
#         fields = '__all__'
#         model = Delivery