import smtplib, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from common.logger import Logger

def smtp_setting(email, password):
    
    Logger.print_log('Getting SMTP data for sending email')

    port = os.getenv('SEND_PORT')
    mail_type = str(os.getenv('SEND_MAIL_SERVER'))

    Logger.print_log('Port: ' + port + ', Server: ' + mail_type)

    # SMTP 세션 생성
    smtp = smtplib.SMTP(mail_type, port)
    smtp.set_debuglevel(True)
    
    # SMTP 계정 인증 설정
    smtp.ehlo()
    smtp.starttls() # TLS 사용시 호출
    smtp.login(email, password) # 로그인

    Logger.print_log('Successfully Logged in')

    return smtp
    
def send_mail(receiver, subject, content):

    Logger.print_main_log('Sending Email to ' + receiver)
    
    email = str(os.getenv('SMTP_EMAIL'))
    password = str(os.getenv('SMTP_PW'))
    Logger.print_log('Email: ' + email + ', Password: ' + password)
    
    # SMTP 세션 생성
    smtp = smtp_setting(email, password)

    # 이메일 데이터 설정
    msg = MIMEText(content, 'html')
    msg['Subject'] = subject
    msg['From'] = email  # 발신자
    msg['To'] = receiver  # 수신자
    Logger.print_log('From: ' + email + ', To: ' + receiver)

    try:
        # 메일 전송
        smtp.sendmail(email, receiver, msg.as_string())
        status = True

        Logger.print_log('Successfully Sent Email')
    except:
        status = False
        Logger.print_error('Error Sending Email')
        raise ValueError('이메일 전송에 실패하였습니다.')
    
    if smtp is not None:
        Logger.print_log('Terminating SMTP')
        smtp.quit()