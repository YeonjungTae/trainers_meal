from django.db import models
import uuid

"""
Parameters
----------
gym_id (UUID)
    헬스장 고유 ID

name (char)
    헬스장 이름

address (char)
    배송지 주소

place_id (int) - nullable
    카카오맵 주소 ID

create_dt (datetime)
    등록 날짜 및 시간

update_dt (datetime)
    업데이트 날짜 및 시간

Note
----
헬스장 정보 테이블
"""   
class Gym(models.Model):
    gym_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '헬스장 고유 ID')
    name = models.CharField(max_length=50, verbose_name = '헬스장 이름')
    address = models.CharField(max_length=200, verbose_name = '헬스장 주소')
    place_id = models.IntegerField(null=True, verbose_name = '카카오맵 주소 ID')
    create_dt = models.DateTimeField(auto_now_add=True, verbose_name = '등록일자')
    update_dt = models.DateTimeField(auto_now=True, verbose_name = '수정일자')

    class Meta:
        db_table = 'gym'

    def __str__(self):
        return '헬스장 이름: ' + self.name

"""
Parameters
----------
trainer_id (UUID)
    트레이너 고유 ID

username (char) - nullable
    로그인 ID

password (char) - nullable
    로그인 PW

name (char)
    이름

email (email)
    이메일

sns_id (char) - nullable
    SNS 로그인 ID

sns_type (int) - nullable
    SNS 종류

is_approved (boolean)
    승인 유무

create_dt (datetime)
    등록 날짜 및 시간

update_dt (datetime)
    업데이트 날짜 및 시간

gym_id (UUID) - FK
    헬스장 고유 ID

Note
----
트레이너 정보 테이블
"""   
class Trainer(models.Model):
    class SNS_Type(models.IntegerChoices):
        NAVER = 0, '네이버'
        GOOGLE = 1, '구글'
        KAKAO = 2, '카카오'

    trainer_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '트레이너 고유 ID')
    username = models.CharField(unique=True, max_length=70, null=True, verbose_name = '로그인 ID')
    password = models.CharField(max_length=100, null=True, verbose_name = '로그인 PW')
    name = models.CharField(max_length=30, verbose_name = '이름')
    email = models.EmailField(verbose_name = '이메일')
    sns_id = models.CharField(max_length=100, null=True, verbose_name = 'SNS 로그인 ID')
    sns_type = models.IntegerField(null=True, choices=SNS_Type.choices, verbose_name = 'SNS 종류')
    is_admin = models.BooleanField(default=False, verbose_name = '관리자 유무')
    is_approved = models.BooleanField(default=False, verbose_name = '승인 유무')
    is_subscribed = models.BooleanField(default=False, verbose_name = '구독 유무')
    create_dt = models.DateTimeField(auto_now_add=True, verbose_name = '등록일자')
    update_dt = models.DateTimeField(auto_now=True, verbose_name = '수정일자')
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE)

    class Meta:
        db_table = 'trainer'

    def __str__(self):
        return '트레이너 이름: ' + self.name + ', 헬스장 이름: ' + str(self.gym.name)
    
class Profile_Image(models.Model):
    profile_image_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '프로필 사진 고유 ID')
    title = models.CharField(unique=True, max_length=50, null=True)
    image = models.ImageField(upload_to='profile_image', blank=True)
    create_dt = models.DateTimeField(auto_now_add=True, verbose_name = '등록일자')
    update_dt = models.DateTimeField(auto_now=True, verbose_name = '수정일자')
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE)

    class Meta:
        db_table = 'profile_image'
    
    def __str__(self):
        return '사진 제목: ' + self.title + ', 경로: ' + self.image.url