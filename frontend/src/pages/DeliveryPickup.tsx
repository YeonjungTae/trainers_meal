import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { main } from "../styles/color";

const DeliveryPickup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    selectedMenus: any[];
    totalPrice: number;
    clientId: string;
  };

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<number>(state.totalPrice);
  const DELIVERY_THRESHOLD = 264000;
  const DELIVERY_FEE = 16000;

  const handleSelect = (option: string) => {
    setSelectedOption(option);

    if (option === "delivery" && state.totalPrice < DELIVERY_THRESHOLD) {
      setFinalPrice(state.totalPrice + DELIVERY_FEE);
    } else {
      setFinalPrice(state.totalPrice);
    }
  };

  const handleNext = () => {
    const deliveryType = selectedOption === "delivery";

    navigate("/delivery-date", {
      state: {
        deliveryType: deliveryType,
        selectedMenus: state.selectedMenus,
        totalPrice: finalPrice,
        clientId: state.clientId,
      },
    });
  };

  return (
    <Container>
      <div className="header">
        <h1>배송/픽업 선택</h1>
      </div>
      <div className="options-container">
        <div
          className={`card ${selectedOption === "delivery" ? "selected" : ""}`}
          onClick={() => handleSelect("delivery")}
        >
          <h2>배송</h2>
          {state.totalPrice < DELIVERY_THRESHOLD && (
            <p className="delivery-fee-info">+ 16,000원</p>
          )}
          <p>집 앞으로 배송을 받아보세요.</p>
        </div>
        <div
          className={`card ${selectedOption === "pickup" ? "selected" : ""}`}
          onClick={() => handleSelect("pickup")}
        >
          <h2>픽업</h2>
          <p>운동 후 음식을 픽업하세요.</p>
        </div>
      </div>

      <BottomBar>
        <p>{finalPrice.toLocaleString()}원</p>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={!selectedOption}
        >
          다음
        </button>
      </BottomBar>
    </Container>
  );
};

export default DeliveryPickup;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-around; */
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;

  .header {
    width: 100%;
    text-align: center;
    margin-bottom: 30px;

    h1 {
      font-size: 28px;
      margin: 0;
    }
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 300px;
    height: 200px;
    padding: 30px;
    margin: 10px 0;
    border: 2px solid #ccc;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    .delivery-fee-info {
      font-size: 20px;
      color: ${main};
    }

    &.selected {
      border-color: ${main};
      background-color: #f0f8ff;
    }

    h2 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    p {
      font-size: 18px;
      color: #555;
    }
  }
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #f7f7f7;

  p {
    font-size: 18px;
    font-weight: bold;
  }

  .next-button {
    background-color: ${main};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    transition: background-color 0.3s;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;
