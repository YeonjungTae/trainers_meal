import { useState } from "react";
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
  onNext: () => void;
  onPrevious: () => void;
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

  const handleNext = () => {
    // 키와 체중이 비어있는지 확인
    if (!height || !weight) {
      setErrorMessage("키와 체중은 필수 입력 사항입니다.");
    } else {
      setErrorMessage("");
      onNext();
    }
  };

  return (
    <Container>
      {/* 필수 입력 사항 */}
      <div className="form-section">
        <SectionTitle>필수 입력 사항</SectionTitle>
        <Input
          type="number"
          label="키(cm) *"
          placeholder="키(cm)를 입력하세요"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <Input
          type="number"
          label="체중(kg) *"
          placeholder="체중(kg)을 입력하세요"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      {/* 선택 입력 사항 */}
      <div className="form-section optional">
        <SectionTitle>선택 입력 사항</SectionTitle>
        <Input
          type="number"
          label="골격근량(kg)"
          placeholder="골격근량(kg)을 입력하세요"
          value={muscleMass}
          onChange={(e) => setMuscleMass(e.target.value)}
        />
        <Input
          type="number"
          label="체지방량(kg)"
          placeholder="체지방량(kg)을 입력하세요"
          value={bodyFatMass}
          onChange={(e) => setBodyFatMass(e.target.value)}
        />
        <Input
          type="number"
          label="체지방률(%)"
          placeholder="체지방률(%)을 입력하세요"
          value={bodyFatPercentage}
          onChange={(e) => setBodyFatPercentage(e.target.value)}
        />
      </div>

      {errorMessage && <Error>{errorMessage}</Error>}
      <div className="button-group">
        <Button onClick={onPrevious} text="이전" color="sub" />
        <Button onClick={handleNext} text="다음" color="main" />
      </div>
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
  }

  .optional {
    margin-top: 30px;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const Error = styled.div`
  color: red;
  font-size: 14px;
  margin-top: -10px;
`;
