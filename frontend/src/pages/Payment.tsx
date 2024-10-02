import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import styled from "styled-components";
import { main } from "../styles/color";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    totalPrice: number;
    clientId?: string;
    deliveryDate: string;
    deliveryType: string;
  } | null;

  if (!state || !state.clientId) {
    alert("잘못된 접근입니다. 처음부터 다시 시도해주세요.");
    return null;
  }

  const { totalPrice, clientId } = state;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handlePayment = async () => {
    try {
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      await apiClient.post("/order/confirm/", {
        clientId,
        totalPrice,
        deliveryDate: state?.deliveryDate,
        deliveryType: state?.deliveryType,
      });
      navigate("/");
    } catch (error) {
      console.error("결제 실패:", error);
    }
  };

  const handleMenu = (): void => navigate(-3);

  return (
    <Container>
      <div className="header">
        <h1>결제 선택</h1>
      </div>
      <div className="summary-box">
        <h2>주문 요약</h2>
        <div className="total">
          <p>총 금액</p>
          <p className="price">{totalPrice.toLocaleString()}원</p>
        </div>
      </div>
      <div className="button-wrapper">
        <Button onClick={handleMenu} text="다시 선택하기" color="sub" />
        <Button onClick={handlePayment} text="결제하기" color="main" />
      </div>
      {isModalOpen && (
        <Modal
          title="결제 확인"
          description={`${totalPrice.toLocaleString()}원을 결제하시겠습니까?`}
          onConfirm={handleConfirmPayment}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </Container>
  );
};

export default Payment;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  padding: 20px;
  margin: 0 auto;

  .header {
    margin-bottom: 40px;
    h1 {
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      color: #343a40;
    }
  }

  .summary-box {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 20px;
      margin-bottom: 20px;
      color: #495057;
    }

    .total {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 18px;
      color: #343a40;

      .price {
        color: ${main};
        font-size: 22px;
      }
    }
  }

  .payment-type {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 30px;

    label {
      font-size: 18px;
      display: flex;
      align-items: center;

      input {
        margin-right: 10px;
      }
    }
  }

  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
`;
