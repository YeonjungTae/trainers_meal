from django.contrib import admin
from .models import Price, Nutrients, Base_Util, Veg_Util, Pro_Util, Flavor_Util, Meal, BaseInfo, VegInfo, ProInfo, FlavorInfo, Order, Order_Detail, Payment

admin.site.register(Price)
admin.site.register(Nutrients)
admin.site.register(Base_Util)
admin.site.register(Veg_Util)
admin.site.register(Pro_Util)
admin.site.register(Flavor_Util)
admin.site.register(Meal)
admin.site.register(BaseInfo)
admin.site.register(VegInfo)
admin.site.register(ProInfo)
admin.site.register(FlavorInfo)
admin.site.register(Order)
admin.site.register(Order_Detail)
admin.site.register(Payment)