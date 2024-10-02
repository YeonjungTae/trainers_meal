from .models import *
from client.models import Client
from .serializers import *
from collections import OrderedDict
import os, jwt, json, base64,requests, math
import unicodedata
import http.client

from datetime import datetime, timedelta

from common.logger import Logger

def round_up(n):
    return math.ceil(n * 0.01) * 100

class OrderClass:
    def get_option_list(request):
        meal = Meal.objects.all()
        return meal
    
    def add_meal_info(request):
        client_id = request.data['clientId']
        meal_cnt = request.data['mealCount']
        meal_list = request.data['selectedMeals']

        amount = 132000 * int(meal_cnt)

        order_data = Order.objects.create(amount=amount, is_pickup=False, delivery_dt=datetime.today(), create_dt=datetime.today(), client_id=client_id)

        for idx, meal_id in enumerate(meal_list):
            base_info = BaseInfo.objects.filter(is_default=True, meal=meal_id)
            pro_info = ProInfo.objects.filter(is_default=True, meal=meal_id)
            veg_info = VegInfo.objects.filter(is_default=True, meal=meal_id)
            flavor_info = FlavorInfo.objects.filter(is_default=True, meal=meal_id)

            week_info = Order_Week.objects.create(week=idx, order_id=order_data.order_id)

            for index, value in enumerate(base_info):
                Order_Detail.objects.create(day=index, base_util_id=base_info[index].base_util.base_util_id, pro_util_id=pro_info[index].pro_util.pro_util_id, veg_util_id=veg_info[index].veg_util.veg_util_id, flavor_util_id=flavor_info[index].flavor_util.flavor_util_id, order_week_id=week_info.order_week_id).save()
            
            week_info.save()
        
        order_data.save()

    def get_meal_list(request):
        client_id = request.GET.get('clientId')

        order_data = Order.objects.filter(client_id=client_id).order_by('-create_dt').first()
        week_info = Order_Week.objects.filter(order_id=order_data.order_id)

        result = []
        for idx, week in enumerate(week_info):
            order_detail = Order_Detail.objects.filter(order_week_id=week.order_week_id).order_by('day')

            week_dict = []

            for index, order in enumerate(order_detail):
                data = {}
                nutrients = {}
                block = {}
                add_block = {}
                data['id'] = str(order.order_detail_id)
                data['day'] = index
                data['menu_name'] = str(order.pro_util.name_tag) + ' ' + str(order.veg_util.name_tag) + ' ' + str(order.base_util.name_tag)
                nutrients['calories'] = str(order.base_util.nutrients.calories + order.pro_util.nutrients.calories + order.veg_util.nutrients.calories + order.flavor_util.nutrients.calories)
                nutrients['carbohydrate'] = str(order.base_util.nutrients.carbohydrate + order.pro_util.nutrients.carbohydrate + order.veg_util.nutrients.carbohydrate + order.flavor_util.nutrients.carbohydrate)
                nutrients['protein'] = str(order.base_util.nutrients.protein + order.pro_util.nutrients.protein + order.veg_util.nutrients.protein + order.flavor_util.nutrients.protein)
                nutrients['fat'] = str(order.base_util.nutrients.fat + order.pro_util.nutrients.fat + order.veg_util.nutrients.fat + order.flavor_util.nutrients.fat)
                nutrients['sodium'] = str(order.base_util.nutrients.sodium + order.pro_util.nutrients.sodium + order.veg_util.nutrients.sodium + order.flavor_util.nutrients.sodium)
                nutrients['sugar'] = str(order.base_util.nutrients.sugar + order.pro_util.nutrients.sugar + order.veg_util.nutrients.sugar + order.flavor_util.nutrients.sugar)
                data['nutrients'] = nutrients
                block['base'] = {'id': str(order.base_util.base_util_id), 'name': order.base_util.block_name}
                block['protein'] = {'id': str(order.pro_util.pro_util_id), 'name': order.pro_util.block_name}
                block['veg'] = {'id': str(order.veg_util.veg_util_id), 'name': order.veg_util.block_name}
                block['flavor'] = {'id': str(order.flavor_util.flavor_util_id), 'name': order.flavor_util.block_name}
                data['block'] = block

                
                try:
                    if Add_Pro.objects.filter(order_detail=order).exists():
                        add_protein = list(Add_Pro.objects.filter(order_detail=order))
                        for index, protein in enumerate(add_protein):
                            add_block['protein' + str(index+1)] = {'id': str(protein.pro_util.pro_util_id), 'name': str(protein.pro_util.block_name)}
                except:
                    pass
                
                try:
                    if Add_Veg.objects.filter(order_detail=order).exists():
                        add_vegetables = list(Add_Veg.objects.filter(order_detail=order))
                        for index, veg in enumerate(add_vegetables):
                            add_block['veg' + str(index+1)] = {'id': str(veg.veg_util.veg_util_id), 'name': str(veg.veg_util.block_name)}
                except:
                    pass

                try:
                    if Add_Flavor.objects.filter(order_detail=order).exists():
                        add_flavor = Add_Flavor.objects.filter(order_detail=order).first()
                        add_block['flavor'] = {'id': str(add_flavor.flavor_util.flavor_util_id), 'name': str(add_flavor.flavor_util.block_name)}
                except:
                    pass
                    
                data['add_block'] = add_block
                data['totalPrice'] = order_data.amount
                week_dict.append(data)

            result.append(week_dict)

        return json.dumps(result, ensure_ascii=False, indent=2)
    
    def get_order_option(request):
            
        tab_index = int(request.GET.get('tabIndex'))
        meal_id = request.GET.get('mealId').split(',')[tab_index]
        day = int(request.GET.get('day'))

        base_info = BaseInfo.objects.filter(day=day, meal_id=meal_id)
        pro_info = ProInfo.objects.filter(day=day, meal_id=meal_id)
        veg_info = VegInfo.objects.filter(day=day, meal_id=meal_id)
        flavor_info = FlavorInfo.objects.filter(day=day, meal_id=meal_id)

        base_price = BaseInfo.objects.get(day=day, meal_id=meal_id, is_default=True).base_util.price.price
        pro_price = ProInfo.objects.get(day=day, meal_id=meal_id, is_default=True).pro_util.price.price
        veg_price = VegInfo.objects.get(day=day, meal_id=meal_id, is_default=True).veg_util.price.price
        flavor_price = FlavorInfo.objects.get(day=day, meal_id=meal_id, is_default=True).flavor_util.price.price

        result = {}

        base_block = list()
        for index, base in enumerate(base_info):
            data = OrderedDict()
            data['id'] = str(base.base_util.base_util_id)
            data['block_name'] = str(base.base_util.block_name)
            difference = int(base.base_util.price.price) - int(base_price)
            if difference < 0:
                difference = 0
            data['difference'] = round_up(difference)
            data['price'] = round_up(base.base_util.price.price)
            data['is_default'] = str(base.is_default)
            base_block.append(data)

        result['base'] = base_block

        pro_block = list()
        for index, pro in enumerate(pro_info):
            data = OrderedDict()
            data['id'] = str(pro.pro_util.pro_util_id)
            data['block_name'] = str(pro.pro_util.block_name)
            difference = int(pro.pro_util.price.price) - int(pro_price)
            if difference < 0:
                difference = 0
            data['difference'] = round_up(difference)
            data['price'] = round_up(pro.pro_util.price.price)
            data['is_default'] = str(pro.is_default)
            pro_block.append(data)

        result['protein'] = pro_block

        veg_block = list()
        for index, veg in enumerate(veg_info):
            data = OrderedDict()
            data['id'] = str(veg.veg_util.veg_util_id)
            data['block_name'] = str(veg.veg_util.block_name)
            difference = int(veg.veg_util.price.price) - int(veg_price)
            if difference < 0:
                difference = 0
            data['difference'] = round_up(difference)
            data['price'] = round_up(veg.veg_util.price.price)
            data['is_default'] = str(veg.is_default)
            veg_block.append(data)

        result['veg'] = veg_block

        flavor_block = list()
        for index, flavor in enumerate(flavor_info):
            data = OrderedDict()
            data['id'] = str(flavor.flavor_util.flavor_util_id)
            data['block_name'] = str(flavor.flavor_util.block_name)
            difference = int(flavor.flavor_util.price.price) - int(flavor_price)
            if difference < 0:
                difference = 0
            data['difference'] = round_up(difference)
            data['price'] = round_up(flavor.flavor_util.price.price)
            data['is_default'] = str(flavor.is_default)
            flavor_block.append(data)

        result['flavor'] = flavor_block

        return json.dumps(result, ensure_ascii=False, indent=2)
    
    def edit_order_list(request):
        client_id = request.data['clientId']
        order_detail_id = request.data['menuId']

        order_detail = Order_Detail.objects.get(order_detail_id=order_detail_id)
        order = Order.objects.get(order_id=order_detail.order_week.order.order_id)

        selectedBase = request.data['selectedBase']
        selectedProtein = request.data['selectedProtein']
        selectedVeg = request.data['selectedVeg']
        selectedFlavor = request.data['selectedFlavor']
        additionalProtein = request.data['additionalProtein']
        additionalVeg = request.data['additionalVeg']
        additionalFlavor = request.data['additionalFlavor']

        defaultPrice = request.data['defaultCost']
        addedPrice = request.data['addedCost']
        print('addedPrice', addedPrice)

        # 초기화
        try:
            Add_Pro.objects.filter(order_detail_id=order_detail_id).delete()
        except:
            pass

        try:
            Add_Veg.objects.filter(order_detail_id=order_detail_id).delete()
        except:
            pass

        try:
            Add_Flavor.objects.filter(order_detail_id=order_detail_id).delete()
        except:
            pass

        # 기본 메뉴 저장
        order_detail.base_util = Base_Util.objects.get(base_util_id=selectedBase)
        order_detail.pro_util = Pro_Util.objects.get(pro_util_id=selectedProtein)
        order_detail.veg_util = Veg_Util.objects.get(veg_util_id=selectedVeg)
        order_detail.flavor_util = Flavor_Util.objects.get(flavor_util_id=selectedFlavor)
        print('original amount', order.amount)
        print('order_detail', order_detail.order_week.order.amount)
        order.amount = (order.amount - defaultPrice) + addedPrice
        print('new price', order.amount)
        order.save()
        order_detail.save()
        
        # 추가 메뉴 저장
        if len(additionalProtein) > 0:
            for pro in additionalProtein:
                Add_Pro.objects.create(pro_util=Pro_Util.objects.get(pro_util_id=pro), order_detail_id=order_detail_id).save()

        if len(additionalVeg) > 0:
            for veg in additionalVeg:
                Add_Veg.objects.create(veg_util=Veg_Util.objects.get(veg_util_id=veg), order_detail_id=order_detail_id).save()

        if len(additionalFlavor) > 0:
            for flavor in additionalFlavor:
                Add_Flavor.objects.create(flavor_util=Flavor_Util.objects.get(flavor_util_id=flavor), order_detail_id=order_detail_id).save()

    def submit_order(request):
        client_id = request.data['clientId']
        amount = request.data['totalPrice']
        is_pickup = request.data['deliveryType']
        delivery_dt = request.data['deliveryDate']

        order_id = Order.objects.filter(client=client_id).order_by('-create_dt').values_list('order_id', flat=True).first()
        Order.objects.filter(client=client_id, order_id=order_id).update(is_pickup=is_pickup, delivery_dt=delivery_dt, amount=amount)