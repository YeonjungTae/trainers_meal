from .models import *
from client.models import Client
from .serializers import *
from collections import OrderedDict
import os, jwt, json, base64,requests
import unicodedata
import http.client

from datetime import datetime, timedelta

from common.logger import Logger

class OrderClass:
    def get_option_list(request):
        meal = Meal.objects.all()
        return meal
    
    def add_meal_info(request):
        client_id = request.data['clientId']
        meal_cnt = request.data['mealCount']
        meal_list = request.data['selectedMeals']

        order_data = Order.objects.create(is_pickup=False, delivery_dt=datetime.today(), create_dt=datetime.today(), client_id=client_id)

        for idx, meal_id in enumerate(meal_list):
            base_info = BaseInfo.objects.filter(is_default=True, meal=meal_id)
            pro_info = ProInfo.objects.filter(is_default=True, meal=meal_id)
            veg_info = VegInfo.objects.filter(is_default=True, meal=meal_id)
            flavor_info = FlavorInfo.objects.filter(is_default=True, meal=meal_id)

            week_info = Order_Week.objects.create(week=idx, order_id=order_data.order_id)

            for index, value in enumerate(base_info):
                Order_Detail.objects.create(day=index, base_util_id=base_info[index].base_util.base_util_id, pro_util_id=pro_info[index].pro_util.pro_util_id, veg_util_id=veg_info[index].veg_util.veg_util_id, flavor_util_id=flavor_info[index].flavor_util.flavor_util_id, order_week_id=week_info.order_week_id).save()
            
            week_info.save()
        
        week_info.save()

    def get_meal_list(request):
        client_id = request.GET.get('clientId')

        order_data = Order.objects.filter(client_id=client_id).order_by('-create_dt').first()
        week_info = Order_Week.objects.filter(order_id=order_data.order_id)

        result = []
        for idx, week in enumerate(week_info):
            order_detail = Order_Detail.objects.filter(order_week_id=week.order_week_id).order_by('day')
            add_money = 0

            if Add_Pro.objects.filter(order_detail=order_detail.values_list('order_detail_id', flat=True).first()).exists():
                add_pro_info = Add_Pro.objects.filter(order_detail=order_detail)
                for add_pro in add_pro_info:
                    add_money += add_pro.pro_util.price.selling_price

            if Add_Veg.objects.filter(order_detail=order_detail.values_list('order_detail_id', flat=True).first()).exists():
                add_veg_info = Add_Veg.objects.filter(order_detail=order_detail)
                for add_veg in add_veg_info:
                    add_money += add_veg.veg_util.price.selling_price

            if Add_Flavor.objects.filter(order_detail=order_detail.values_list('order_detail_id', flat=True).first()).exists():
                add_flavor_info = Add_Flavor.objects.filter(order_detail=order_detail)
                for add_flavor in add_flavor_info:
                    add_money += add_flavor.flavor_util.price.selling_price

            week_dict = []

            for index, order in enumerate(order_detail):
                data = {}
                nutrients = {}
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
                data['price'] = order.base_util.price.selling_price + order.pro_util.price.selling_price + order.veg_util.price.selling_price + order.flavor_util.price.selling_price + add_money
                
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

        base_price = BaseInfo.objects.get(day=day, meal_id=meal_id, is_default=True).base_util.price.selling_price
        pro_price = ProInfo.objects.get(day=day, meal_id=meal_id, is_default=True).pro_util.price.selling_price
        veg_price = VegInfo.objects.get(day=day, meal_id=meal_id, is_default=True).veg_util.price.selling_price
        flavor_price = FlavorInfo.objects.get(day=day, meal_id=meal_id, is_default=True).flavor_util.price.selling_price

        result = {}

        base_block = list()
        for index, base in enumerate(base_info):
            data = OrderedDict()
            data['id'] = str(base.base_util.base_util_id)
            data['block_name'] = str(base.base_util.block_name)
            difference = int(base.base_util.price.selling_price) - int(base_price)
            if difference < 0:
                difference = 0
            data['difference'] = difference
            data['price'] = base.base_util.price.selling_price
            data['is_default'] = str(base.is_default)
            base_block.append(data)

        result['base'] = base_block

        pro_block = list()
        for index, pro in enumerate(pro_info):
            data = OrderedDict()
            data['id'] = str(pro.pro_util.pro_util_id)
            data['block_name'] = str(pro.pro_util.block_name)
            difference = int(pro.pro_util.price.selling_price) - int(pro_price)
            if difference < 0:
                difference = 0
            data['difference'] = difference
            data['price'] = pro.pro_util.price.selling_price
            data['is_default'] = str(pro.is_default)
            pro_block.append(data)

        result['protein'] = pro_block

        veg_block = list()
        for index, veg in enumerate(veg_info):
            data = OrderedDict()
            data['id'] = str(veg.veg_util.veg_util_id)
            data['block_name'] = str(veg.veg_util.block_name)
            difference = int(veg.veg_util.price.selling_price) - int(veg_price)
            if difference < 0:
                difference = 0
            data['difference'] = difference
            data['price'] = veg.veg_util.price.selling_price
            data['is_default'] = str(veg.is_default)
            veg_block.append(data)

        result['veg'] = veg_block

        flavor_block = list()
        for index, flavor in enumerate(flavor_info):
            data = OrderedDict()
            data['id'] = str(flavor.flavor_util.flavor_util_id)
            data['block_name'] = str(flavor.flavor_util.block_name)
            difference = int(flavor.flavor_util.price.selling_price) - int(flavor_price)
            if difference < 0:
                difference = 0
            data['difference'] = difference
            data['price'] = flavor.flavor_util.price.selling_price
            data['is_default'] = str(flavor.is_default)
            flavor_block.append(data)

        result['flavor'] = flavor_block

        return json.dumps(result, ensure_ascii=False, indent=2)
    
    def edit_order_list(request):
        client_id = request.data['clientId']
        week_info = request.data['tabIndex']
        day_info = request.data['menuIndex']
        selectedBase = request.data['selectedBase']
        selectedProtein = request.data['selectedProtein']
        selectedVeg = request.data['selectedVeg']
        selectedFlavor = request.data['selectedFlavor']
        additionalProtein = request.data['additionalProtein']
        additionalVeg = request.data['additionalVeg']
        additionalFlavor = request.data['additionalFlavor']

        order_id = Order.objects.filter(client=client_id).order_by('-create_dt').values_list('order_id', flat=True).first()
        order_week_info = Order_Week.objects.filter(week=week_info, order=order_id).values_list('order_week_id', flat=True).first()
        order_detail_info = Order_Detail.objects.filter(day=day_info, order_week=order_week_info)
        
        if additionalProtein != None:
            for pro in additionalProtein:
                Add_Pro.objects.create(pro_util=Pro_Util.objects.get(pro_util_id=pro), order_detail=Order_Detail.objects.get(day=day_info, order_week=order_week_info))

        if additionalVeg != None:
            for veg in additionalVeg:
                Add_Veg.objects.create(veg_util=Veg_Util.objects.get(veg_util_id=veg), order_detail=Order_Detail.objects.get(day=day_info, order_week=order_week_info))

        if additionalFlavor != None:
            for flavor in additionalFlavor:
                Add_Flavor.objects.create(flavor_util=Flavor_Util.objects.get(flavor_util_id=flavor), order_detail=Order_Detail.objects.get(day=day_info, order_week=order_week_info))

        order_detail_info.update(base_util=selectedBase, pro_util=selectedProtein, veg_util=selectedVeg, flavor_util=selectedFlavor)


    def submit_order(request):
        client_id = request.data['clientId']
        amount = request.data['totalPrice']
        is_pickup = request.data['deliveryType']
        delivery_dt = request.data['deliveryDate']

        order_id = Order.objects.filter(client=client_id).order_by('-create_dt').values_list('order_id', flat=True).first()
        Order.objects.filter(client=client_id, order_id=order_id).update(is_pickup=is_pickup, delivery_dt=delivery_dt)
        Payment.objects.create(amount=amount, toss_order_id='', payment_key='', request_dt=datetime.today(), order_id=order_id)

    import ssl
    ssl._create_default_https_context = ssl._create_unverified_context

    def confirm_payment(request):
        toss_order_id = request.data['orderId']
        amount = str(request.data['amount'])
        payment_key = request.data['paymentKey']
        paymentType = request.data['paymentType']
        print(toss_order_id, amount, payment_key)
        widgetSecretKey = 'live_gsk_kYG57Eba3GjMMmWQNW798pWDOxmA:'
        encryptedSecretKey = "Basic " + base64.b64encode(widgetSecretKey.encode("utf-8")).decode("utf-8")

        # conn = http.client.HTTPSConnection("api.tosspayments.com")

        base_url = "https://api.tosspayments.com/"
        api_version = "v1"

        data={
            "paymentKey": payment_key,
            "orderId": toss_order_id,
            "amount": amount,
        },
        # payload = "{\"paymentType\":" + paymentType +"\"paymentKey\":" + payment_key +",\"orderId\":" + toss_order_id + ",\"amount\":" + amount + "}"

        headers = {
            "Authorization": encryptedSecretKey,
            "Content-Type": "application/json"
        }

        requests_session = requests.Session()
        requests_adapters = requests.adapters.HTTPAdapter(max_retries=3)
        requests_session.mount("https://", requests_adapters)

        response = requests_session.post(base_url + api_version + '/payments/confirm',
            data={
                "paymentKey": payment_key, 
                "orderId": toss_order_id,
                "amount": amount,
            }
        )

        result = response.json()

        print(result)

        # conn.request("POST", "/v1/payments/confirm", payload, headers)

        # res = conn.getresponse()
        # data = res.read()

        # print(data.decode("utf-8"))

    def submit_payment(request):
        client_id = request.data['clientId']
        amount = request.data['amount']
        toss_order_id = request.data['orderId']
        payment_key = request.data['paymentKey']
        status = request.data['status']
        request_dt = request.data['confirmDate']

        order_id = Order.objects.filter(client=client_id).order_by('-create_dt').values_list('order_id', flat=True).first()
        Payment.objects.filter(order_id=order_id).update(amount=amount, status=3, toss_order_id=toss_order_id, customer_key=client_id, payment_key=payment_key, request_dt=request_dt)
        Client.objects.filter(client_id=client_id).update(is_subscribed=True)