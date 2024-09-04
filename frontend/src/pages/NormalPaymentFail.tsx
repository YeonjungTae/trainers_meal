import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

const NormalPaymentFail: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <Container>
      <div className="result wrapper">
        <div className="box_section">
          <h2>
            결제 실패
          </h2>
          <p>{`에러 코드: ${searchParams.get("code")}`}</p>
          <p>{`실패 사유: ${searchParams.get("message")}`}</p>
        </div>
      </div>
    </Container>
  );
};

export default NormalPaymentFail;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  box-sizing: border-box;
  background-color: #f5f5f5;

  .wrapper {
    width: 100%;
  }
  
  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;

    button {
      padding: 10px 20px;
      font-size: 18px;
      color: white;
      background-color: #007bff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
`;