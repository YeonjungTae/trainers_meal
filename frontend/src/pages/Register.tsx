import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import Input from "../components/ui/InputComponent";
import Button from "../components/ui/Button";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { lineGray } from "../styles/color";

interface GymOption {
  gym_id: string;
  name: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [emailId, setEmailId] = useState<string>(""); // 이메일 아이디 부분
  const [emailDomain, setEmailDomain] = useState<string>(""); // 이메일 도메인 부분
  const [customDomain, setCustomDomain] = useState<string>(""); // 직접 입력 도메인
  const [gymOptions, setGymOptions] = useState<GymOption[]>([]);
  const [selectedGym, setSelectedGym] = useState<string>("");
  const [confirmIdError, setConfirmIdError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const validatePassword = (password: string) => {
    return (
      password.length >= 8 &&
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?~`\\/-]*$/.test(
        password
      )
    );
  };

  useEffect(() => {
    const fetchGymOptions = async () => {
      try {
        const response = await apiClient.get("/get_gym_list/");
        setGymOptions(response.data);
      } catch (error) {
        console.error("헬스장 목록을 불러오는데 실패했습니다:", error);
        alert("헬스장 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
      }
    };
    fetchGymOptions();
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    let isValid = true;

    if (!id.length || confirmIdError.length) {
      setConfirmIdError("아이디를 확인해 주세요.");
      isValid = false;
    } else {
      setConfirmIdError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("비밀번호는 8자 이상 영문, 숫자 조합으로 입력해주세요.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    const finalEmailDomain =
      emailDomain === "custom" ? customDomain : emailDomain;
    const email = `${emailId}@${finalEmailDomain}`;

    if (isValid) {
      try {
        await apiClient.post("/register/", {
          username: id,
          password: password,
          name: name,
          email: email,
          selectedGym: selectedGym,
        });
        alert("회원 가입에 성공했습니다. 로그인 화면으로 돌아갑니다.");
        navigate("/login");
      } catch (error) {
        console.error(error);
        alert("회원 가입에 실패하였습니다. 다시 시도해 주세요.");
      }
    }
  };

  const handleDuplicateCheck = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      await apiClient.get(`/register?username=${id}`);
      setConfirmIdError("");
      alert("등록 가능한 아이디입니다.");
    } catch (error) {
      setConfirmIdError("이미 존재하는 아이디입니다.");
    }
  };

  return (
    <Container>
      <img src={logo} alt="logo" className="logo" />
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <Input
            type="text"
            id="name"
            placeholder="이름을 입력하세요"
            className="text-input"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="id">아이디</label>
          <div className="id-group">
            <Input
              type="text"
              id="id"
              placeholder="ID를 입력하세요"
              className="text-input"
              value={id}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setId(e.target.value)
              }
            />
            <Button
              text="중복체크"
              onClick={handleDuplicateCheck}
              className="duplicate-check-button"
              color="main"
            />
          </div>
          {confirmIdError && (
            <span className="error-message">{confirmIdError}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <Input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            className="text-input"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          {passwordError && (
            <span className="error-message">{passwordError}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="비밀번호를 확인하세요"
            className="text-input"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
          {confirmPasswordError && (
            <span className="error-message">{confirmPasswordError}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일 주소</label>
          <div className="email-group">
            <Input
              type="text"
              id="emailId"
              placeholder="이메일 아이디를 입력하세요"
              className="text-input"
              value={emailId}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmailId(e.target.value)
              }
            />
            <span className="at-symbol">@</span>
            <select
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              className="email-select"
            >
              <option value="" disabled>
                도메인을 선택하세요
              </option>
              <option value="gmail.com">gmail.com</option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>
          {emailDomain === "custom" && (
            <Input
              type="text"
              placeholder="직접 도메인을 입력하세요"
              className="text-input"
              value={customDomain}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCustomDomain(e.target.value)
              }
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="gym">헬스장 선택</label>
          <select
            id="gym"
            className="gym-select"
            value={selectedGym}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSelectedGym(e.target.value)
            }
          >
            <option value="" disabled>
              헬스장을 선택하세요
            </option>
            {gymOptions.map((gym) => (
              <option key={gym.gym_id} value={gym.gym_id}>
                {gym.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          text="회원 가입"
          onClick={handleRegister}
          className="register-button"
          color="main"
        />
      </form>
    </Container>
  );
};

export default Register;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;

  .logo {
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: 1em;
    width: 400px;

    .form-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 14px;
      width: 100%;
      padding: 0 1.5em;

      label {
        margin-bottom: 5px;
      }

      .text-input,
      .gym-select {
        width: 100%;
        height: 40px;
        border-radius: 5px;
        border: 1px solid ${lineGray};
        padding: 0 10px;
        font-size: 16px;
      }

      .id-group {
        display: flex;
        justify-content: space-between;
        width: 100%;

        .text-input {
          width: 70%;
          height: 40px;
          border-radius: 5px;
          border: 1px solid ${lineGray};
          padding: 0 10px;
          font-size: 16px;
        }

        .duplicate-check-button {
          width: 25%;
          height: 40px;
        }
      }

      .email-group {
        display: flex;
        gap: 10px;
        width: 100%;
        align-items: center;

        .text-input {
          width: 40%;
          height: 40px;
          border-radius: 5px;
          border: 1px solid ${lineGray};
          padding: 0 10px;
          font-size: 16px;
        }

        .at-symbol {
          font-size: 18px;
          display: flex;
          align-items: center;
        }

        .email-select {
          width: 50%;
          height: 40px;
          border-radius: 5px;
          border: 1px solid ${lineGray};
          padding: 0 10px;
        }
      }
    }

    .register-button {
      margin-top: 20px;
    }

    .error-message {
      margin-top: 5px;
      color: red;
      font-size: 12px;
    }
  }
`;
