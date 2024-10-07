from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from .lesik_admin import Excel

# # 로그인 함수
# def index(request):
#     """
#     Parameters
#     ----------
#     request
#         불러와진 페이지에서 전달 받은 데이터

#     Returns
#     ----------
#     render
#         페이지에 전달할 데이터
#     redirect
#         페이지 이동 데이터
        
#     Note
#     ----
#     login page를 띄우는 함수
#     """
#     # 로그인 정보가 있다면
#     # if request.session.get('user'):
#     #     return redirect('mail/') # 메인 페이지로 넘긴다

#     # 만약 로그인 시도를 하는 것이라면
#     if request.method == 'POST':
#         form = LoginForm(request.POST) # 로그인

#         # 만약 로그인이 성공적으로 되었다면
#         if form.is_valid():
#             request.session['user'] = form.user_info # 세션에 값을 저장하고 메인 페이지로 넘긴다
#             return redirect('mail/')

#     # 아니라면 로그인 폼을 새로 지정해 준다
#     else:
#         form = LoginForm()

#     return render(request, 'login.html', {'form': form, 'page': 'login'})

# # 로그아웃 함수    
# def logout(request):
#     """
#     Parameters
#     ----------
#     request
#         불러와진 페이지에서 전달 받은 데이터

#     Returns
#     ----------
#     redirect
#         페이지 이동 데이터
        
#     Note
#     ----
#     login 데이터를 전부 삭제하고 로그아웃시키는 함수
#     """
#     # session에 저장된 로그인 정보가 있다면
#     if request.session.get('user'):
#         del(request.session['user'])
	
#     # 로그아웃 후 로그인 페이지로 이동  
#     return redirect('/')

class excel(APIView):
    def get(self, request):
        output = Excel.save_list()

        return HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

        # return Response(serializer.data)