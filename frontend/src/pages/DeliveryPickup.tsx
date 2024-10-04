import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "../api";
import AddressDeliveryInfo from "../components/member/AddressDeliveryInfo";
import Button from "../components/ui/Button";
import styled from "styled-components";
import { main } from "../styles/color";

const DELIVERY_THRESHOLD = 264000;
const DELIVERY_FEE = 16000;

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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [deliveryMessage, setDeliveryMessage] = useState<string>("");
  const [entryMethod, setEntryMethod] = useState<string>("0");
  const [entryPassword, setEntryPassword] = useState<string>("");
  const [isAddressFetched, setIsAddressFetched] = useState<boolean>(false); // 주소 정보가 있는지 여부
  const [isAddressRequired, setIsAddressRequired] = useState<boolean>(false); // 주소가 필요한지 여부

  useEffect(() => {
    const fetchAddressInfo = async () => {
      try {
        const { data } = await apiClient.get(
          `/client/address?client_id=${state.clientId}`
        );
        const { address, detailAddress } = JSON.parse(data);

        if (address && detailAddress) {
          setAddress(address);
          setDetailAddress(detailAddress);
          setIsAddressFetched(true);
        } else {
          setIsAddressFetched(false);
        }
      } catch (error) {
        console.error(error);
        setIsAddressFetched(false);
      }
    };

    fetchAddressInfo();
  }, [state.clientId]);

  // 주소 저장 처리
  const onRegister = async () => {
    try {
      const payload = {
        clientId: state.clientId,
        address,
        detailAddress,
        deliveryMessage,
        entryMethod,
        entryPassword,
      };

      await apiClient.post(`/client/address/`, payload);
      alert("주소가 성공적으로 저장되었습니다.");
      setIsAddressModalOpen(false);
      setIsAddressFetched(true);
    } catch (error) {
      console.error("주소 저장 실패:", error);
    }
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);

    if (option === "delivery") {
      if (state.totalPrice < DELIVERY_THRESHOLD) {
        setFinalPrice(state.totalPrice + DELIVERY_FEE);
      } else {
        setFinalPrice(state.totalPrice);
      }
      setIsAddressRequired(true);
    } else {
      setIsAddressRequired(false);
    }
  };

  const handleNext = () => {
    if (
      isAddressRequired &&
      !isAddressFetched &&
      (!address || !detailAddress)
    ) {
      alert("배송지 정보를 입력해주세요.");
      return;
    }

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
            <p className="delivery-fee-info">+ {DELIVERY_FEE}원</p>
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
      <div className="bottom-wrapper">
        <p>{finalPrice.toLocaleString()}원</p>
        <div className="button-wrapper">
          {selectedOption === "delivery" && (
            <Button
              color="sub"
              text="배송지 입력하기"
              className="address-button"
              onClick={() => setIsAddressModalOpen(true)}
            />
          )}
          <Button
            color="main"
            text="결제하기"
            className="next-button"
            onClick={handleNext}
            disabled={
              !selectedOption || (isAddressRequired && !isAddressFetched)
            }
          />
        </div>
      </div>
      {isAddressModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <Button
              text="X"
              className="close-button"
              onClick={() => setIsAddressModalOpen(false)}
            />
            <AddressDeliveryInfo
              address={address}
              setAddress={setAddress}
              detailAddress={detailAddress}
              setDetailAddress={setDetailAddress}
              deliveryMessage={deliveryMessage}
              setDeliveryMessage={setDeliveryMessage}
              entryMethod={entryMethod}
              setEntryMethod={setEntryMethod}
              entryPassword={entryPassword}
              setEntryPassword={setEntryPassword}
            />
            <Button
              text="저장하기"
              className="save-button"
              onClick={onRegister}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default DeliveryPickup;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

  .bottom-wrapper {
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

    .button-wrapper {
      button {
        width: 170px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
        transition: background-color 0.3s;
      }

      button + button {
        margin-left: 10px;
      }

      .next-button {
        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      }
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  width: 500px;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .close-button {
    position: absolute;
    top: 10px;
    right: -50px;
    font-size: 20px;
    cursor: pointer;
  }

  .save-button {
    background-color: ${main};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    margin-top: 20px;
  }
`;
