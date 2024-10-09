import axios from "axios";
import Button from "../components/ui/Button";
import styled from "styled-components";


const Admin = () => {

  const handleDownload = async () => {

    try {
      const response = await axios.post(import.meta.env.VITE_BASE_URL + "admin/",
        {responseType: 'blob'}
      );

      const a = document.createElement('a');
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

    //   var FileSaver = require('file-saver');
    //   FileSaver.saveAs(blob, 'excel.xlsx');

      a.href = window.URL.createObjectURL(blob);
      a.target = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);

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
