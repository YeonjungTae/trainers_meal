from django.db import models
import uuid

"""
Parameters
----------
admin_id (UUID)
    관리자 고유 ID

username (char)
    관리자 로그인 ID

password (char)
    관리자 로그인 PW

name (char)
    관리자 이름

email (char)
    관리자 이메일

create_dt (datetime)
    등록 날짜 및 시간

update_dt (datetime)
    업데이트 날짜 및 시간

Note
----
헬스장 정보 테이블
"""   
class Lesik_Admin(models.Model):
    admin_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name = '관리자 고유 ID')
    username = models.CharField(unique=True, max_length=70, null=True, verbose_name = '관리자 로그인 ID')
    password = models.CharField(max_length=100, null=True, verbose_name = '관리자 로그인 PW')
    name = models.CharField(max_length=50, verbose_name = '관리자 이름')
    email = models.EmailField(verbose_name = '관리자 이메일')
    create_dt = models.DateTimeField(auto_now_add=True, verbose_name = '등록일자')
    update_dt = models.DateTimeField(auto_now=True, verbose_name = '수정일자')

    class Meta:
        db_table = 'admin'

    def __str__(self):
        return '관리자 이름: ' + self.name