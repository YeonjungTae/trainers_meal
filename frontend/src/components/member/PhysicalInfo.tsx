import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Input from "../ui/InputComponent";
import Button from "../ui/Button";

interface PhysicalInfoProps {
  height: string;
  setHeight: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  muscleMass: string;
  setMuscleMass: (value: string) => void;
  bodyFatMass: string;
  setBodyFatMass: (value: string) => void;
  bodyFatPercentage: string;
  setBodyFatPercentage: (value: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const PhysicalInfo: React.FC<PhysicalInfoProps> = ({
  height,
  setHeight,
  weight,
  setWeight,
  muscleMass,
  setMuscleMass,
  bodyFatMass,
  setBodyFatMass,
  bodyFatPercentage,
  setBodyFatPercentage,
  onNext,
  onPrevious,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const location = useLocation();

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const value = e.target.value;
    const onlyNumbers = value.replace(/[^0-9.]/g, "");
    setter(onlyNumbers);
  };

  useEffect(() => {
    if (height && weight) {
      setIsFormValid(true);
      setErrorMessage("");
    } else {
      setIsFormValid(false);
    }
  }, [height, weight]);

  const handleNext = () => {
    if (!height || !weight) {
      setErrorMessage("키와 체중은 필수 입력 사항입니다.");
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <Container>
      {/* 필수 입력 사항 */}
      <div className="form-section">
        <h3>필수 입력 사항</h3>
        <Input
          type="text"
          label="키(cm) *"
          placeholder="키(cm)를 입력하세요"
          value={height}
          onChange={(e) => handleNumberInput(e, setHeight)}
        />
        <Input
          type="text"
          label="체중(kg) *"
          placeholder="체중(kg)을 입력하세요"
          value={weight}
          onChange={(e) => handleNumberInput(e, setWeight)}
        />
      </div>

      {/* 선택 입력 사항 */}
      <div className="form-section optional">
        <h3>선택 입력 사항</h3>
        <Input
          type="text"
          label="골격근량(kg)"
          placeholder="골격근량(kg)을 입력하세요"
          value={muscleMass}
          onChange={(e) => handleNumberInput(e, setMuscleMass)}
        />
        <Input
          type="text"
          label="체지방량(kg)"
          placeholder="체지방량(kg)을 입력하세요"
          value={bodyFatMass}
          onChange={(e) => handleNumberInput(e, setBodyFatMass)}
        />
        <Input
          type="text"
          label="체지방률(%)"
          placeholder="체지방률(%)을 입력하세요"
          value={bodyFatPercentage}
          onChange={(e) => handleNumberInput(e, setBodyFatPercentage)}
        />
      </div>

      {errorMessage && <div className="error">{errorMessage}</div>}
      {location.pathname === "/add" && (
        <div className="button-group">
          <Button onClick={onPrevious} text="이전" color="sub" />
          <Button
            onClick={handleNext}
            text="다음"
            color="main"
            disabled={!isFormValid}
          />
        </div>
      )}
    </Container>
  );
};

export default PhysicalInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 15px;

    h3 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
    }
  }

  .optional {
    margin-top: 30px;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
  }

  .error {
    color: red;
    font-size: 14px;
    margin-top: -10px;
  }
`;
