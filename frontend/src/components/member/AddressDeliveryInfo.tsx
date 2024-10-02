import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Input from "../ui/InputComponent";
import Button from "../ui/Button";
import DaumPostcode from "react-daum-postcode";
import { main } from "../../styles/color";
import { apiClient } from "../../api";

interface AddressDeliveryInfoProps {
  address: string;
  setAddress: (value: string) => void;
  detailAddress: string;
  setDetailAddress: (value: string) => void;
  deliveryMessage: string;
  setDeliveryMessage: (value: string) => void;
  entryMethod: string;
  setEntryMethod: (value: string) => void;
  entryPassword: string;
  setEntryPassword: (value: string) => void;
  onRegister?: () => void;
  onPrevious?: () => void;
}

const AddressDeliveryInfo: React.FC<AddressDeliveryInfoProps> = ({
  address,
  setAddress,
  detailAddress,
  setDetailAddress,
  deliveryMessage,
  setDeliveryMessage,
  entryMethod,
  setEntryMethod,
  entryPassword,
  setEntryPassword,
  onRegister,
  onPrevious,
}) => {
  const location = useLocation();
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const handleAddressComplete = (data: any) => {
    setAddress(data.address);
    setIsAddressOpen(false);
  };

  const [deliveryOptions, setDeliveryOptions] = useState<[]>([]);
  const [entryOptions, setEntryOptions] = useState<[]>([]);

  const entryMethodMapping: { [key: number]: string } = {
    0: "비밀번호",
    1: "경비실 호출",
    2: "자유출입가능",
  };

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const response = await apiClient.get("/client/delivery/");
        setDeliveryOptions(response.data.deliveryMessage);
        setEntryOptions(response.data.entryMethod);
      } catch (error) {
        console.error("옵션을 불러오는데 실패했습니다:", error);
      }
    };

    fetchDeliveryOptions();
  }, []);

  useEffect(() => {
    if (
      address &&
      detailAddress &&
      deliveryMessage &&
      (entryMethod !== "비밀번호" ||
        (entryMethod === "비밀번호" && entryPassword))
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [address, detailAddress, deliveryMessage, entryMethod, entryPassword]);

  return (
    <Container>
      <div className="skip-button">
        {location.pathname === "/add" && (
          <Button text="다음에 입력하기" onClick={onRegister} color="sub" />
        )}
      </div>
      <div className="address-section">
        <label>배송지 주소</label>
        <div className="address-input-group">
          <Input
            type="text"
            placeholder="배송지 주소를 입력하세요"
            value={address}
            readonly={true}
          />
          <button onClick={() => setIsAddressOpen(true)}>주소 검색</button>
        </div>
        {isAddressOpen && (
          <Modal>
            <div className="content">
              <DaumPostcode
                onComplete={handleAddressComplete}
                style={{ width: "100%", height: "100%" }}
              />
              <button
                className="close-button"
                onClick={() => setIsAddressOpen(false)}
              >
                닫기
              </button>
            </div>
          </Modal>
        )}
        <Input
          type="text"
          placeholder="상세 주소를 입력하세요"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />
      </div>

      <div className="delivery-options">
        <div className="title">배송 요청사항</div>
        <div className="delivery-message">
          <label>배송메시지</label>
          <select
            value={deliveryMessage}
            onChange={(e) => setDeliveryMessage(e.target.value)}
          >
            {deliveryOptions.map((delivery: any) => (
              <option key={delivery.index} value={delivery.data}>
                {delivery.data}
              </option>
            ))}
          </select>
        </div>
        <div className="entry-method">
          <label>공동현관 출입방법</label>
          <div>
            {entryOptions.map((entry: any) => (
              <div key={entry.index}>
                <Input
                  type="radio"
                  id={entry.data}
                  name="entry"
                  onChange={() => setEntryMethod(entry.index)}
                  checked={
                    entryMethodMapping[Number(entryMethod)] === entry.data
                  }
                />
                <label htmlFor={entry.data}>{entry.data}</label>
              </div>
            ))}
          </div>
          {entryMethod === "비밀번호" && (
            <Input
              type="text"
              label="공동현관 비밀번호"
              placeholder="공동현관 비밀번호를 입력해주세요"
              value={entryPassword}
              onChange={(e) => setEntryPassword(e.target.value)}
            />
          )}
        </div>
      </div>
      {location.pathname === "/add" && (
        <div className="button-group">
          <Button onClick={onPrevious} text="이전" color="sub" />
          <Button
            onClick={onRegister}
            text="등록"
            color="main"
            disabled={!isFormValid}
          />
        </div>
      )}
    </Container>
  );
};

export default AddressDeliveryInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .skip-button {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .address-section {
    display: flex;
    flex-direction: column;
    gap: 10px;

    label {
      margin-bottom: 5px;
      font-weight: bold;
    }

    .address-input-group {
      display: flex;
      align-items: center;

      button {
        margin-left: 10px;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f5f5f5;
        cursor: pointer;
      }
    }
  }

  .delivery-options {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;

    .title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .delivery-message,
    .entry-method {
      margin-bottom: 15px;
    }

    .entry-method div {
      display: flex;
      gap: 10px;
    }

    .privacy {
      margin-top: 10px;

      Input {
        margin-right: 10px;
      }
    }
  }

  .button-group {
    display: flex;
    justify-content: center;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .content {
    background-color: white;
    width: 90%;
    max-width: 600px;
    height: 80%;
    position: relative;
    border-radius: 10px;
    overflow: hidden;

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      border: none;
      border-radius: 5px;
      background-color: ${main};
      color: white;
      cursor: pointer;
    }
  }
`;
