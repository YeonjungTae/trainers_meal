from django.db import models
from trainer.models import Trainer
import uuid

"""
Parameters
----------
client_id (UUID)
    등록 고객 고유 ID

name (char)
    고객명

contact (int)
    연락처

gender (int) - nullable
    성별

birth (date)
    생년월일

height (decimal)
    신장

weight (decimal)
    체중

activity (int) - nullable
    활동량

goal (int) - nullable
    운동 목표

memo (text) - nullable
    메모

create_dt (datetime)
    생성 날짜 및 시간

update_dt (datetime)
    업데이트 날짜 및 시간

Note
----
등록 고객 정보 테이블
"""   
class Client(models.Model):
    class Gender(models.IntegerChoices):
        MALE = 0, '남'
        FEMALE = 1, '여'

    class Activity(models.IntegerChoices):
        LOW = 0, '정적 (운동을 거의 하지 않음)'
        LIGHT = 1, '가벼운 활동 (주 1~2일 운동)'
        MODERATE = 2, '적당히 활동적 (주 3~5일 운동)'
        ACTIVE = 3, '매우 활동적 (주 6~7일 운동)'
        ATHLETE = 4, '선수 (매일 2회 이상 운동)'

    class Goal(models.IntegerChoices):
        SHARP_DROP = 0, '급격한 체중 감량 (~1kg/주)'
        DROP = 1, '적당한 체중 감량 (~0.5kg/주)'
        SLOW_DROP = 2, '천천한 체중 감량 (~0.25kg/주)'
        MAINTAIN = 3, '체중 유지'
        SLOW_INCREASE = 4, '천천한 체중 증량 (~0.25kg/주)'
        INCREASE = 5, '적당한 체중 증량 (~0.5kg/주)'
        SHARP_INCREASE = 6, '빠른 체중 증량 (~1kg/주)'
        
    client_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '등록 고객 고유 ID')
    name = models.CharField(max_length=30, verbose_name = '고객명')
    contact = models.CharField(max_length=15, verbose_name = '연락처')
    gender = models.IntegerField(choices=Gender.choices, null=True, verbose_name = '성별')
    birth = models.DateField(verbose_name = '생년월일')
    activity = models.IntegerField(choices=Activity.choices, null=True, verbose_name = '활동량')
    goal = models.IntegerField(choices=Goal.choices, null=True, verbose_name = '운동 목표')
    memo = models.TextField(null=True, verbose_name = '메모')
    is_subscribed = models.BooleanField(default=False, verbose_name = '구독 유무')
    subscribe_dt = models.DateTimeField(auto_now=True, verbose_name='구독일자')
    create_dt = models.DateTimeField(auto_now_add=True, verbose_name = '등록일자')
    update_dt = models.DateTimeField(auto_now=True, verbose_name = '수정일자')
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE)

    class Meta:
        db_table = 'client'

    def __str__(self):
        return '고객명: ' + self.name

"""
Parameters
----------
body_data_id (UUID)
    신체 정보 고유 ID

skeletal_muscle (decimal)
    활동량

body_fat (decimal)
    체지방량

body_fat_ratio (decimal)
    체지방률

bmr (decimal) - nullable
    기초 대사량 (BMR)

tdee (decimal) - nullable
    활동 대사량 (TDEE)

bmi (decimal) - nullable
    체질량 지수 (BMI)

bmi_rank (int) - nullable
    BMI 등급

update_dt (datetime)
    업데이트 날짜 및 시간

client_id (UUID) - FK
    등록 고객 고유 ID

Note
----
신체 정보 테이블
"""   
class Body_Data(models.Model):
    class Bmi_Rank(models.IntegerChoices):
        UNDERWEIGHT = 0, '저체중'
        HEALTHY = 1, '정상'
        OVERWEIGHT = 2, '과체중'
        CLASS1 = 3, '1단계 비만'
        CLASS2 = 4, '2단계 비만'
        CLASS3 = 5, '3단계 비만 (고도)'

    body_data_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '신체 정보 고유 ID')
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '신장')
    weight = models.DecimalField(default=0, max_digits=5, decimal_places=2, verbose_name = '체중')
    skeletal_muscle = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '골격근량')
    body_fat = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '체지방량')
    body_fat_ratio = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '체지방률')
    bmr = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '기초 대사량 (BMR)')
    tdee = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '활동 대사량 (TDEE)')
    bmi = models.DecimalField(max_digits=5, decimal_places=2, null=True, verbose_name = '체질량 지수 (BMI)')
    bmi_rank = models.IntegerField(choices=Bmi_Rank.choices, null=True, verbose_name = 'BMI 등급')
    update_dt = models.DateTimeField(auto_now_add=True, verbose_name = '수정일자')
    client = models.ForeignKey(Client, on_delete=models.CASCADE)

    class Meta:
        db_table = 'body_data'

    def __str__(self):
        return '골격근량: ' + str(self.skeletal_muscle) + ', 체지방량: ' + str(self.body_fat) + ', 체지방률: ' + str(self.body_fat_ratio)

"""
Parameters
----------
delivery_id (UUID)
    배송 정보 고유 ID

address (char)
    배송지 주소

address_detail (char)
    상세 주소

doorlock (int) - nullable
    공동 현관 번호

doorlock_type (int)
    공동 현관 출입 방법

message (int)
    배송 메시지

message_detail (char) - nullable
    직접 입력 메시지

update_dt (datetime)
    업데이트 날짜 및 시간

client_id (UUID) - FK
    등록 고객 고유 ID

Note
----
배송 정보 테이블
"""   
class Delivery(models.Model):
    class Doorlock_Type(models.IntegerChoices):
        PASSWORD = 0, '비밀번호'
        CALL_JANITOR = 1, '경비실 호출'
        NO_PASSWORD = 2, '자유출입가능'

    class Message(models.IntegerChoices):
        NOT_SELECTED = 0, '배송메시지를 선택해주세요.'
        AT_DOORWAY = 1, '문 앞에 놔주세요'
        INPUT = 2, '직접 입력'

    delivery_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '배송 정보 고유 ID')
    address = models.CharField(max_length=200, null=True, verbose_name = '배송지 주소')
    address_detail = models.CharField(max_length=50, null=True, verbose_name = '상세 주소')
    doorlock = models.IntegerField(null=True, verbose_name = '공동 현관 번호')
    doorlock_type = models.IntegerField(choices=Doorlock_Type.choices, verbose_name = '공동 현관 출입 방법')
    message = models.IntegerField(null=True, choices=Message.choices, verbose_name = '배송 메시지')
    message_detail = models.CharField(max_length=100, null=True, verbose_name = '직접 입력 메시지')
    update_dt = models.DateTimeField(auto_now_add=True, verbose_name = '수정일자')
    client = models.ForeignKey(Client, on_delete=models.CASCADE)

    class Meta:
        db_table = 'delivery'

    def __str__(self):
        return '배송지 주소: ' + self.address
