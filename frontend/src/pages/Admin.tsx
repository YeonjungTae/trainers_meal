
import { apiClient } from "../api";
import Button from "../components/ui/Button";
import styled from "styled-components";


const Admin = () => {

  const handleDownload = async () => {

    try {
      const response = await apiClient.post("/");

      const regx = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

      if (regx.test(response.data)) {
        alert(response.data);
        return;
      }

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
