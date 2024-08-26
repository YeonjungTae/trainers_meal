from django.db import models
from client.models import Client
import uuid

class Day(models.IntegerChoices):
    MONDAY = 0, '월요일'
    TUESDAY = 1, '화요일'
    WEDNESDAY = 2, '수요일'
    THURSDAY = 3, '목요일'
    FRIDAY = 4, '금요일'
    SATURDAY = 5, '토요일'

"""
Parameters
----------
base_id (UUID)
    베이스 고유 ID

price (int)
    실제 원가

selling_price (int)
    소비자가

Note
----
베이스 정보 테이블
"""   
class Price(models.Model):
    price_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '가격 고유 ID')
    price = models.IntegerField(verbose_name = '실제 원가')
    selling_price = models.IntegerField(verbose_name = '소비자가')

    class Meta:
        db_table = 'price'

    def __str__(self):
        return '원가: ' + str(self.price) + ' 원, 소비자가: ' + str(self.selling_price) + ' 원'

"""
Parameters
----------
nutrients_id (UUID)
    영양 성분 고유 ID

calories (Decimal)
    에너지 (kcal)

carbohydrate (Decimal)
    탄수화물 (g)

protein (Decimal)
    단백질 (g)

sugar (Decimal)
    총 당류 (g)

sodium (Decimal)
    나트륨 (mg)

fat (Decimal)
    지방 (g)

total_fatty_acids (Decimal)
    총 포화 지방산 (g)

trans_fatty_acid (Decimal)
    트랜스 지방산 (g)

Note
----
영양 성분 정보 테이블
"""   
class Nutrients(models.Model):
    nutrients_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '영양 성분 고유 ID')
    calories = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '에너지 (kcal)')
    carbohydrate = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '탄수화물 (g)')
    protein = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '단백질 (g)')
    sugar = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '총 당류 (g)')
    sodium = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '나트륨 (mg)')
    fat = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '지방 (g)')
    total_fatty_acids = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '총 포화 지방산 (g)')
    trans_fatty_acid = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '트랜스 지방산 (g)')

    class Meta:
        db_table = 'nutrients'

    def __str__(self):
        return '총 열량: ' + str(self.calories)

"""
Parameters
----------
base_util_id (UUID)
    베이스 유틸 고유 ID

code (char)
    베이스 유틸 코드명

block_name (char)
    블록명

name_tag (char)
    네이밍 태그

Note
----
베이스 유틸 정보 테이블
"""   
class Base_Util(models.Model):
    base_util_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '베이스 유틸 고유 ID')
    code = models.CharField(max_length=10, verbose_name = '베이스 유틸 코드명')
    block_name = models.CharField(max_length=100, verbose_name = '블록명')
    name_tag = models.CharField(max_length=100, verbose_name = '네이밍 태그')
    price = models.ForeignKey(Price, on_delete=models.CASCADE)
    nutrients = models.ForeignKey(Nutrients, on_delete=models.CASCADE)

    class Meta:
        db_table = 'base_util'

    def __str__(self):
        return '베이스 유틸 블록명: ' + self.block_name

"""
Parameters
----------
veg_util_id (UUID)
    채소 유틸 고유 ID

code (char)
    채소 유틸 코드명

block_name (char)
    블록명

name_tag (char)
    네이밍 태그

Note
----
채소 유틸 정보 테이블
"""   
class Veg_Util(models.Model):
    veg_util_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '채소 유틸 고유 ID')
    code = models.CharField(max_length=10, verbose_name = '채소 유틸 코드명')
    block_name = models.CharField(max_length=100, verbose_name = '블록명')
    name_tag = models.CharField(max_length=100, verbose_name = '네이밍 태그')
    price = models.ForeignKey(Price, on_delete=models.CASCADE)
    nutrients = models.ForeignKey(Nutrients, on_delete=models.CASCADE)

    class Meta:
        db_table = 'veg_util'

    def __str__(self):
        return '채소 유틸 블록명: ' + self.block_name

"""
Parameters
----------
pro_util_id (UUID)
    단백 유틸 고유 ID

code (char)
    단백 유틸 코드명

block_name (char)
    블록명

name_tag (char)
    네이밍 태그

Note
----
단백 유틸 정보 테이블
"""   
class Pro_Util(models.Model):
    pro_util_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '단백 유틸 고유 ID')
    code = models.CharField(max_length=10, verbose_name = '단백 유틸 코드명')
    block_name = models.CharField(max_length=100, verbose_name = '블록명')
    name_tag = models.CharField(max_length=100, verbose_name = '네이밍 태그')
    price = models.ForeignKey(Price, on_delete=models.CASCADE)
    nutrients = models.ForeignKey(Nutrients, on_delete=models.CASCADE)

    class Meta:
        db_table = 'pro_util'

    def __str__(self):
        return '단백 유틸 블록명: ' + self.block_name

"""
Parameters
----------
flavor_util_id (UUID)
    소스 유틸 고유 ID

code (char)
    소스 유틸 코드명

block_name (char)
    블록명

name_tag (char)
    네이밍 태그

Note
----
소스 유틸 정보 테이블
"""   
class Flavor_Util(models.Model):
    flavor_util_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '소스 유틸 고유 ID')
    code = models.CharField(max_length=10, verbose_name = '소스 유틸 코드명')
    block_name = models.CharField(max_length=100, verbose_name = '블록명')
    name_tag = models.CharField(max_length=100, verbose_name = '네이밍 태그')
    price = models.ForeignKey(Price, on_delete=models.CASCADE)
    nutrients = models.ForeignKey(Nutrients, on_delete=models.CASCADE)

    class Meta:
        db_table = 'flavor_util'

    def __str__(self):
        return '소스 유틸 블록명: ' + self.block_name

"""
Parameters
----------
meal_id (UUID)
    식단 유형 고유 ID

group (char)
    식단 유형명

normal_price (int)
    정상가

subscript_price (int)
    구독가

discount (int)
    할인액

discount_rate (Decimal)
    할인율

Note
----
식단 유형 정보 테이블
"""   
class Meal(models.Model):
    meal_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '식단 유형 고유 ID')
    group = models.CharField(max_length=50, verbose_name = '식단 유형명')
    normal_price = models.IntegerField(verbose_name = '정상가')
    subscript_price = models.IntegerField(verbose_name = '구독가')
    discount = models.IntegerField(verbose_name = '할인액')
    discount_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '할인율')

    class Meta:
        db_table = 'meal'

    def __str__(self):
        return '식단 유형명: ' + self.group

"""
Parameters
----------
baseinfo_id (UUID)
    베이스 유틸 상세 고유 ID

day (int)
    요일

is_default (boolean)
    기본 요리 유무

meal_id (UUID)
    식단 고유 ID

base_util_id (UUID)
    베이스 유틸 고유 ID

Note
----
베이스 유틸 상세 정보 테이블
"""

class BaseInfo(models.Model):
    baseinfo_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '베이스 유틸 상세 고유 ID')
    day = models.IntegerField(choices=Day.choices, verbose_name = '요일')
    is_default = models.BooleanField(default=False, verbose_name = '기본 요리 유무')
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    base_util = models.ForeignKey(Base_Util, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'base_info'

    def __str__(self):
        return 'Base (day: ' + Day(self.day).label + ', default: ' + str(self.is_default) + ')'


"""
Parameters
----------
veginfo_id (UUID)
    채소 유틸 상세 고유 ID

day (int)
    요일

is_default (boolean)
    기본 요리 유무

meal_id (UUID)
    식단 고유 ID

veg_util_id (UUID)
    채소 유틸 고유 ID

Note
----
채소 유틸 상세 정보 테이블
"""

class VegInfo(models.Model):
    veginfo_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '채소 유틸 상세 고유 ID')
    day = models.IntegerField(choices=Day.choices, verbose_name = '요일')
    is_default = models.BooleanField(default=False, verbose_name = '기본 요리 유무')
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    veg_util = models.ForeignKey(Veg_Util, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'veg_info'

    def __str__(self):
        return 'Veg (day: ' + Day(self.day).label + ', default: ' + str(self.is_default) + ')'

"""
Parameters
----------
proinfo_id (UUID)
    단백 유틸 상세 고유 ID

day (int)
    요일

is_default (boolean)
    기본 요리 유무

meal_id (UUID)
    식단 고유 ID

pro_util_id (UUID)
    단백 유틸 고유 ID

Note
----
단백 유틸 상세 정보 테이블
"""

class ProInfo(models.Model):
    proinfo_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '단백 유틸 상세 고유 ID')
    day = models.IntegerField(choices=Day.choices, verbose_name = '요일')
    is_default = models.BooleanField(default=False, verbose_name = '기본 요리 유무')
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    pro_util = models.ForeignKey(Pro_Util, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'pro_info'

    def __str__(self):
        return 'Pro (day: ' + Day(self.day).label + ', default: ' + str(self.is_default) + ')'

"""
Parameters
----------
flavorinfo_id (UUID)
    소스 유틸 상세 고유 ID

day (int)
    요일

is_default (boolean)
    기본 요리 유무

meal_id (UUID)
    식단 고유 ID

flavor_util_id (UUID)
    소스 유틸 고유 ID

Note
----
소스 유틸 상세 정보 테이블
"""

class FlavorInfo(models.Model):
    flavorinfo_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '소스 유틸 상세 고유 ID')
    day = models.IntegerField(choices=Day.choices, verbose_name = '요일')
    is_default = models.BooleanField(default=False, verbose_name = '기본 요리 유무')
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    flavor_util = models.ForeignKey(Flavor_Util, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'flavor_info'

    def __str__(self):
        return 'Flavor (day: ' + Day(self.day).label + ', default: ' + str(self.is_default) + ')'

"""
Parameters
----------
order_id (UUID)
    주문 고유 ID

is_pickup (boolean)
    픽업 유무

delivery_dt (date)
    배송일자

create_dt (datetime)
    신청일자

client_id (UUID) - FK
    등록 고객 고유 ID

Note
----
주문 정보 테이블
"""   
class Order(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '주문 고유 ID')
    is_pickup = models.BooleanField(default=False, verbose_name = '픽업 유무')
    delivery_dt = models.DateField(verbose_name = '배송일자')
    create_dt = models.DateTimeField(auto_now_add=True, verbose_name = '신청일자')
    client = models.ForeignKey(Client, on_delete=models.CASCADE)

    class Meta:
        db_table = 'order'

    def __str__(self):
        return '픽업 유무: ' + str(self.is_pickup) + ', 배송일자: ' + str(self.delivery_dt)

class Order_Week(models.Model):
    order_week_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '주문한 주 고유 ID')
    week = models.IntegerField(default=0, verbose_name = '몇 번째 주')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    class Meta:
        db_table = 'order_week'

    def __str__(self):
        return str(self.week) + ' 번째 주 식단'

"""
Parameters
----------
order_detail_id (UUID)
    주문 상세 고유 ID

day (int)
    요일

base_util_id (UUID)
    베이스 유틸 고유 ID

veg_util_id (UUID)
    채소 유틸 고유 ID

pro_util_id (UUID)
    단백 유틸 고유 ID

flavor_util_id (UUID)
    소스 유틸 고유 ID

order_id (UUID)
    주문 고유 ID

Note
----
주문 상세 정보 테이블
"""   
class Order_Detail(models.Model):
    order_detail_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '주문 상세 고유 ID')
    day = models.IntegerField(choices=Day.choices, verbose_name = '요일')
    base_util = models.ForeignKey(Base_Util, on_delete=models.CASCADE)
    veg_util = models.ForeignKey(Veg_Util, on_delete=models.CASCADE)
    pro_util = models.ForeignKey(Pro_Util, on_delete=models.CASCADE)
    flavor_util = models.ForeignKey(Flavor_Util, on_delete=models.CASCADE)
    order_week = models.ForeignKey(Order_Week, on_delete=models.CASCADE)

    class Meta:
        db_table = 'order_detail'

    def __str__(self):
        return '요일: ' + str(self.day) + ' (베이스 유틸: ' + self.base_util.block_name + ', 채소 유틸: ' + self.veg_util.block_name + ', 단백 유틸: ' + self.pro_util.block_name + ', 소스 유틸: ' + self.flavor_util.block_name + ')'

"""
Parameters
----------    
payment_id (UUID)
    결제 고유 ID

amount (int)
    총 결제 금액

status (int)
    결제 처리 상태

toss_order_id (char)
    토스 주문 ID

customer_key (char) - nullable
    고객 KEY (정기 결제)

billing_key (char) - nullable
    카드 정보 암호화 KEY (정기 결제)

payment_key (char)
    결제 KEY

request_dt (datetime)
    요청일자

order_id (UUID)
    주문 고유 ID

Note
----
주문 상세 정보 테이블
"""   
class Payment(models.Model):
    class Status(models.IntegerChoices):
        READY = 0, '초기 상태'
        IN_PROGRESS = 1, '결제 수단 인증 완료'
        WAITING_FOR_DEPOSIT = 2, '가상계좌 입금 대기'
        DONE = 3, '결제 승인'
        CANCELED = 4, '결제 취소'
        PARTIAL_CANCELED = 5, '결제 부분 취소'
        ABORTED = 6, '결제 승인 실패'
        EXPIRED = 7, '시간 초과'
        
    payment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '결제 고유 ID')
    amount = models.IntegerField(verbose_name = '총 결제 금액')
    status = models.IntegerField(choices=Status.choices, null=True, verbose_name = '결제 처리 상태')
    toss_order_id = models.CharField(max_length=100, verbose_name = '토스 주문 ID')
    customer_key = models.CharField(max_length=100, null=True, verbose_name = '고객 KEY (정기 결제)')
    billing_key = models.CharField(max_length=100, null=True, verbose_name = '카드 정보 암호화 KEY (정기 결제)')
    payment_key = models.CharField(max_length=100, verbose_name = '결제 KEY')
    request_dt = models.DateTimeField(auto_now_add=True, verbose_name = '요청일자')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    class Meta:
        db_table = 'payment'
    
    def __str__(self):
        return '결제 상태: ' + str(self.status) + ', 금액: ' + str(self.amount) + ', 결제 요청일: ' + str(self.request_dt)

class Menu_Image(models.Model):
    menu_image_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '메뉴 사진 고유 ID')
    title = models.CharField(unique=True, max_length=50, null=True)
    image = models.ImageField(upload_to='menu_image', blank=True)
    create_dt = models.DateTimeField(auto_now_add=True, verbose_name = '등록일자')
    update_dt = models.DateTimeField(auto_now=True, verbose_name = '수정일자')

    class Meta:
        db_table = 'menu_image'
    
    def __str__(self):
        return '사진 제목: ' + self.title

class Add_Pro(models.Model):
    add_pro_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '추가 단백질 고유 ID')
    pro_util = models.ForeignKey(Pro_Util, on_delete=models.CASCADE)
    order_detail = models.ForeignKey(Order_Detail, on_delete=models.CASCADE)

    class Meta:
        db_table = 'add_pro'
    
    def __str__(self):
        return '추가 단백질: ' + self.pro_util.block_name

class Add_Veg(models.Model):
    add_veg_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '추가 채소 고유 ID')
    veg_util = models.ForeignKey(Veg_Util, on_delete=models.CASCADE)
    order_detail = models.ForeignKey(Order_Detail, on_delete=models.CASCADE)

    class Meta:
        db_table = 'add_veg'
    
    def __str__(self):
        return '추가 채소: ' + self.veg_util.block_name

class Add_Flavor(models.Model):
    add_flavor_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '추가 소스 고유 ID')
    flavor_util = models.ForeignKey(Flavor_Util, on_delete=models.CASCADE)
    order_detail = models.ForeignKey(Order_Detail, on_delete=models.CASCADE)

    class Meta:
        db_table = 'add_flavor'
    
    def __str__(self):
        return '추가 소스: ' + self.flavor_util.block_name