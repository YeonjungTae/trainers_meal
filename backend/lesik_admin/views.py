from rest_framework.views import APIView
from django.http import FileResponse
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from .lesik_admin import Excel

# # 로그인 함수
def index(request):
    """
    Parameters
    ----------
    request
        불러와진 페이지에서 전달 받은 데이터

    Returns
    ----------
    render
        페이지에 전달할 데이터
    redirect
        페이지 이동 데이터
        
    Note
    ----
    admin page를 띄우는 함수
    """
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

    return render(request, 'lesik_admin.html', {'page': 'lesik_admin'})

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

def excel(request):
    output = Excel().save_list()

    return HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

# def excel(request):
#         # output = Excel().save_list()
#         # print(output.read())

#     output = Excel().save_list()

#         # response = HttpResponse(content_type='text/csv')
#         # response['Content-Disposition'] = 'attachment; filename="mydata.csv"'
#         # response = HttpResponse(content=output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
#         # response["Content-Disposition"] = "attachment; filename*=utf-8''{}".format('text.xlsx')


#         # output.close(response)
#         # response = HttpResponse(content=output.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
#         # response["Content-Disposition"] = "attachment; filename*=utf-8''{}".format('text.xlsx')

#         # return response

#     return FileResponse(output.getvalue(), as_attachment=True, filename='test.xlsx')

    # writer = csv.writer(response)
    # writer.writerow(['ID', 'Name', 'Email'])

    # for obj in MyModel.objects.all():
    #     writer.writerow([obj.id, obj.name, obj.email])

    # return output

    # response = HttpResponse(
    #     content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    # )
    # response['Content-Disposition'] = 'attachment; filename="myfile.xlsx"'

    # return response

    # writer = csv.writer(response)

    # return FileResponse(output.read())
    # return FileResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


    # return Response(serializer.data)