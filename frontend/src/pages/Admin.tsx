// import {ExcelRenderer, OutTable} from 'react-excel-renderer';
// import { apiClient } from "../api";
// import * as FileSaver from 'file-saver';
import Button from "../components/ui/Button";
import styled from "styled-components";
import axios from "axios";

const Admin = () => {

  const handleDownload = async () => {

    try {
    //   const response = await apiClient.post("admin/");
      const response = await axios.post('http://127.0.0.1:8000/admin/', { 

      // const response = await axios.post('http://3.37.154.71:8000/admin/', { 
        responseType: 'arraybuffer' });

        var blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const a = document.createElement('a');

        a.href = window.URL.createObjectURL(blob);
        a.target = '_blank';
        a.download = 'temp.xlsx'
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);


    //   const a = document.createElement('a');
    //   const blob = new Blob([response.data], {
    //     // type: 'text/csv'
    //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    //   });

    //   a.href = window.URL.createObjectURL(blob);
    //   a.target = '_blank';
    //   a.style.display = 'none';
    //   document.body.appendChild(a);
    //   a.click();
    //   URL.revokeObjectURL(a.href);
    //   document.body.removeChild(a);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Button text="주문 리스트 다운로드" className="download-button" color="main" onClick={handleDownload} />
    </Container>
  );
};

export default Admin;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;
