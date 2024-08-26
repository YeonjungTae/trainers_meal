from .models import *
from .serializers import *
import os, random
from passlib.hash import pbkdf2_sha256
from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist

from .smtp import send_mail

from common.logger import Logger

def hash_password(original_pw):
    """
    Parameters
    ----------
    original_pw (str)
        기존 비밀번호

    Returns
    ----------
    pw (str)
        암호화한 비밀번호
        
    Note
    ----
    시드 값으로 고정적인 값을 얻기 위해 추가로 문자열을 넣어 단방향으로 비밀번호를 암호화하는 함수
    """
    Logger.print_main_log('Hashing password with sha256')
    pw = pbkdf2_sha256.hash(str(original_pw) + str('1q2w3e4r'))
    Logger.print_log('Successfully hashed password with sha256')

    return pw

def check_password(original_pw, hashed_pw):
    """
    Parameters
    ----------
    original_pw (str)
        기존 비밀번호
    hashed_pw (str)
        암호화된 비밀번호

    Returns
    ----------
    chk (Boolean)
        비밀번호 일치 유무
        
    Note
    ----
    사용자가 입력한 비밀번호가 맞는지 확인하는 함수
    """ 
    Logger.print_main_log('Checking hashed password with sha256')
    chk = pbkdf2_sha256.verify(original_pw + str('1q2w3e4r'), hashed_pw)
    Logger.print_log('Successfully checked hashed password with sha256')

    return chk

class TrainerClass:
    """
    Parameters
    ----------
    AuthenticationForm
        로그인 시도하면서 입력된 ID와 PW 값
        
    Returns
    ----------
    user_info (dict)
        로그인된 유저 데이터
    add_error (dict)
        로그인 실패 이유 데이터
    cleaned_data (dict)
        로그인에 필요한 정보 데이터
        
    Note
    ----
    DB에 일치하는 계정이 있는지 확인하는 함수
    """ 
    def login(**kwargs):
        Logger.print_log('Checking if ID and PW is correct')

        username = kwargs.get('username')
        password = kwargs.get('password')

        # 아이디와 비밀번호를 받아서 출력 (비밀번호는 sha256로 암호화)
        print('Login ID: ' + str(username))

        # 만약 요청을 받은 아이디와 비밀번호가 존재한다면
        if username and password:
            try:
                trainer = Trainer.objects.get(username=username)
                
                if trainer.is_approved:
                    if check_password(password, trainer.password):
                        Logger.print_log('로그인에 성공했습니다.')
                        return trainer
                            
                    else:
                        Logger.print_error('비밀번호가 잘못되었습니다.')
                        return '비밀번호가 잘못되었습니다.'

                else:
                    Logger.print_log('관리자의 승인이 필요합니다.')
                    return '관리자의 승인이 필요합니다.'
                    
            except ObjectDoesNotExist:
                Logger.print_error('아이디가 존재하지 않습니다.')
                return '아이디가 존재하지 않습니다.'
            
    def get_profile_img(**kwargs):
        Logger.print_log('Getting Profile Image')

        trainer_id = kwargs.get('trainer').trainer_id
        username = kwargs.get('trainer').username

        try:
            return Profile_Image.objects.get(title=username, trainer=trainer_id)
        
        except:
            return Profile_Image.objects.get(title='default')

    def get_gym_list():
        return Gym.objects.all()

    def check_id(**kwargs):
        Logger.print_main_log('Check ID')

        username = kwargs.get('username')

        if Trainer.objects.filter(username=username).exists():
            Logger.print_log('ID Exists')
            return ValueError('이미 존재하는 아이디입니다.')
        else:
            return '등록할 수 있는 아이디입니다.'
 
    def register(**kwargs):
        Logger.print_main_log('Signing Up')

        username = kwargs.get('username')
        password = hash_password(kwargs.get('password'))
        name = kwargs.get('name')
        email = kwargs.get('email')
        gym = Gym.objects.get(gym_id=kwargs.get('gym'))

        new_trainer = Trainer.objects.create(username=username, password=password, name=name, email=email, gym=gym, is_approved=False, create_dt=datetime.today(), update_dt=datetime.today())

        print(new_trainer)
        Logger.print_log('Successfully Signed Up')

    def get_authcode(**kwargs):
        Logger.print_main_log('Getting Authcode for Re-registering pw')

        username = kwargs.get('username')
        name = kwargs.get('name')

        # 만약 요청을 받은 아이디와 비밀번호가 존재한다면
        if username and name:
            try:
                trainer = Trainer.objects.get(username=username, name=name)
            except:
                Logger.print_error('이름과 이메일을 확인해 주세요.')

                raise ValueError('이름과 이메일을 확인해 주세요.')
                
            Logger.print_log('계정이 존재합니다.')
            
            alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
            password = ''
            
            for i in range(6):
                index = random.randrange(len(alphabet))
                password = password + alphabet[index]

            try:
                send_mail(trainer.email, '[트레이너스밀] 요청 코드', password)
                return password

            except:
                raise ValueError('이메일 전송에 실패하였습니다.')

    def change_password(**kwargs):
        name = kwargs.get('name')
        email = kwargs.get('email')
        password = hash_password(kwargs.get('password'))

        if password:
            Trainer.objects.filter(name=name, email=email).update(password=password)

    def get_username(**kwargs):
        name = kwargs.get('name')
        email = kwargs.get('email')

        if name and email:
            try:
                username = Trainer.objects.get(name=name, email=email).username

            except:
                raise ValueError('입력된 정보를 다시 확인해 주세요.')
                
            try:
                send_mail(email, '[트레이너스밀] 아이디 찾기', username)
                return True
            except:
                raise ValueError('이메일 전송에 실패했습니다.')
