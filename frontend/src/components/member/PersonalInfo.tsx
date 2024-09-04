import { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../ui/InputComponent";
import Button from "../ui/Button";
import { main } from "../../styles/color";

interface PersonalInfoProps {
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  birthdate: string;
  setBirthdate: (value: string) => void;
  onNext: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  name,
  setName,
  phone,
  setPhone,
  gender,
  setGender,
  birthdate,
  setBirthdate,
  onNext,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (name && phone && gender && birthdate) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, phone, gender, birthdate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/;
    if (regex.test(value)) {
      setPhone(value);
    }
  };

  const handleNext = () => {
    if (!name || !phone || !gender || !birthdate) {
      setErrorMessage("모든 필드를 입력해주세요.");
    } else {
      setErrorMessage("");
      onNext();
    }
  };

  return (
    <Container>
      <Input
        type="text"
        label="이름"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={handleNameChange}
      />
      <Input
        type="text"
        label="전화번호"
        placeholder="ex.01000000000"
        value={phone}
        onChange={handlePhoneChange}
      />
      <div className="gender-section">
        <label>성별</label>
        <div className="gender-toggle">
          <Button
            className={gender === "남" ? "active" : ""}
            onClick={() => setGender("남")}
            text="남"
          />
          <Button
            className={gender === "여" ? "active" : ""}
            onClick={() => setGender("여")}
            text="여"
          />
        </div>
      </div>
      <div className="date-section">
        <label>생년월일</label>
        <Input
          type="date"
          label=""
          placeholder="클릭하여 생년월일을 선택하세요"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>
      {errorMessage && <Error>{errorMessage}</Error>}
      <Button
        onClick={handleNext}
        text="다음"
        color="main"
        disabled={!isFormValid}
      />
    </Container>
  );
};

export default PersonalInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  label::after {
    content: " *";
    color: #ff0000;
  }

  .gender-section {
    display: flex;
    flex-direction: column;
    gap: 10px;

    label {
      font-weight: bold;
    }

    .gender-toggle {
      display: flex;
      gap: 10px;

      button {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f5f5f5;
        cursor: pointer;

        &.active {
          background-color: ${main};
          color: white;
          border: 1px solid ${main};
        }
      }
    }
  }

  .date-section {
    display: flex;
    flex-direction: column;
    gap: 10px;

    label {
      font-weight: bold;
    }

    input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
    }
  }
`;

const Error = styled.div`
  color: red;
  font-size: 14px;
  margin-top: -10px;
`;
