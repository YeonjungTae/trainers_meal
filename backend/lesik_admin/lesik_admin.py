import os, xlsxwriter, uuid
from io import BytesIO

class Excel:
    def __init__(self):
        pass

    def save_list(self, **kwargs):
        """   
        Parameters
        ----------
        kwargs
            불러와진 페이지에서 전달 받은 데이터
    
        Note
        ----
        업체 리스트를 엑셀 파일로 다운받는 함수
        """
        index_list = kwargs.get('index').split(',')
        rank_list = kwargs.get('rank').split(',')
        short_manager_list = kwargs.get('short_manager').split(',')
        company_list = kwargs.get('company').split(',')
        manager_list = kwargs.get('manager').split(',')
        material_list = kwargs.get('material').split(',')
        purity_list = kwargs.get('purity').split(',')
        particle_size_list = kwargs.get('particle_size').split(',')
        email_list = kwargs.get('email').split(',')
        mail_date_list = kwargs.get('mail_date').split(',')

        output = BytesIO()
        workbook = xlsxwriter.Workbook(output)
        worksheet = workbook.add_worksheet('주문 목록')
        bold = workbook.add_format({'bold': True, 'align': 'center', 'valign': 'vcenter'})
        columns = index_list

        row = 0
        for idx, val in enumerate(columns):
            worksheet.write(row, idx, val, bold)
        row += 1

        for idx, val in enumerate(rank_list): 
            worksheet.write(row, 0, rank_list[idx])
            worksheet.write(row, 1, short_manager_list[idx])
            worksheet.write(row, 2, company_list[idx])
            worksheet.write(row, 3, manager_list[idx])
            worksheet.write(row, 4, material_list[idx])
            worksheet.write(row, 5, purity_list[idx])
            worksheet.write(row, 6, particle_size_list[idx])
            worksheet.write(row, 7, email_list[idx])
            worksheet.write(row, 8, mail_date_list[idx])
            row += 1

        workbook.close()
        output.seek(0)


        return output

    # def save_excel_form(self, **kwargs):
    #     """   
    #     Parameters
    #     ----------
    #     kwargs
    #         불러와진 페이지에서 전달 받은 데이터
        
    #     Note
    #     ----
    #     대량 업로드를 위한 엑셀 폼을 다운받는 함수
    #     """
    #     index_list = kwargs.get('index').split(',')[:-1]

    #     output = BytesIO()
    #     workbook = xlsxwriter.Workbook(output)
    #     worksheet = workbook.add_worksheet('고객 목록')
    #     bold = workbook.add_format({'bold': True})
    #     columns = index_list

    #     row = 0
    #     for idx, val in enumerate(columns):
    #         worksheet.write(row, idx, val, bold)

    #     workbook.close()
    #     output.seek(0)
        
    #     return output

    # def save_bulk_data(self, **kwargs):
    #     """   
    #     Parameters
    #     ----------
    #     kwargs
    #         불러와진 페이지에서 전달 받은 데이터
    
    #     Note
    #     ----
    #     넘어온 데이터로 대량 업로드를 하는 함수
    #     """
    #     Logger.print_main_log('Starting Bulk Uploading client in Client page')
        
    #     ext = kwargs.get('file').name.split('.')[-1]

    #     if 'csv' in ext:
    #         test = pd.read_csv(kwargs.get('file'), encoding='cp949')
    #     else:
    #         test = pd.read_excel(kwargs.get('file'))

    #     for list in test.values.tolist():
    #         client_id = uuid.uuid4()
    #         Client(id=client_id, client_rank=str(list[0]), short_manager=str(list[1]), company=str(list[2]), manager=str(list[3]), email=str(list[7])).save()


    #         if str(list[4]) != 'nan':
    #             try:
    #                 material_id = Material.objects.get(name=str(list[4])).id
    #                 Client.objects.filter(id=client_id).update(material_id=material_id)
    #             except:
    #                 material_id = uuid.uuid4()
    #                 Material(id=material_id, name=str(list[4])).save()
    #                 Client.objects.filter(id=client_id).update(material_id=material_id)


    #         if str(list[5]) != 'nan':
    #             try:
    #                 purity_id = Purity.objects.get(purity=str(list[5])).id
    #                 Client.objects.filter(id=client_id).update(purity_id=purity_id)
    #             except:
    #                 purity_id = uuid.uuid4()
    #                 Purity(id=purity_id, purity=str(list[5])).save()
    #                 Client.objects.filter(id=client_id).update(purity_id=purity_id)

    #         if str(list[6]) != 'nan':
    #             try:
    #                 particle_id = Particle.objects.get(particle_size=str(list[6])).id
    #                 Client.objects.filter(id=client_id).update(particle_id=particle_id)

    #             except:
    #                 particle_id = uuid.uuid4()
    #                 Particle(id=particle_id, particle_size=str(list[6])).save()
    #                 Client.objects.filter(id=client_id).update(particle_id=particle_id)

    #     Logger.print_log('Successfully Bulk Uploaded client in Client page')

