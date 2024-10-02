import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../../api";
import styled from "styled-components";
import Input from "../ui/InputComponent";
import Button from "../ui/Button";

interface GoalActivityInfoProps {
  activityLevel: string;
  setActivityLevel: (value: string) => void;
  goal: string;
  setGoal: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const GoalActivityInfo: React.FC<GoalActivityInfoProps> = ({
  activityLevel,
  setActivityLevel,
  goal,
  setGoal,
  notes,
  setNotes,
  onNext,
  onPrevious,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [activityOptions, setActivityOptions] = useState<[]>([]);
  const [goalOptions, setGoalOptions] = useState<[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchActivityOptions = async () => {
      try {
        const response = await apiClient.get("/client/option/");
        setActivityOptions(response.data.activity);
        setGoalOptions(response.data.goal);
      } catch (error) {
        console.error("옵션을 불러오는데 실패했습니다:", error);
        alert("옵션을 불러오는데 실패했습니다. 다시 시도해주세요.");
      }
    };

    fetchActivityOptions();
  }, []);

  console.log(12313, notes);

  const handleNext = () => {
    if (!activityLevel || !goal) {
      setErrorMessage("모든 필드를 입력해주세요.");
    } else {
      setErrorMessage("");
      if (onNext) onNext();
    }
  };

  return (
    <Container>
      <div className="select-wrapper">
        <label>활동량</label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
        >
          {activityOptions.map((activity: any) => (
            <option key={activity.index} value={activity.index}>
              {activity.data}
            </option>
          ))}
        </select>
      </div>
      <div className="select-wrapper">
        <label>운동 목표</label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          {goalOptions.map((goalOption: any) => (
            <option key={goalOption.index} value={goalOption.index}>
              {goalOption.data}
            </option>
          ))}
        </select>
      </div>
      <Input
        type="text"
        label="메모"
        placeholder="추가 메모를 입력하세요"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      {errorMessage && <Error>{errorMessage}</Error>}
      {location.pathname === "/add" && (
        <div className="button-group">
          <Button onClick={onPrevious} text="이전" color="sub" />
          <Button onClick={handleNext} text="다음" color="main" />
        </div>
      )}
    </Container>
  );
};

export default GoalActivityInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;

    label {
      font-weight: bold;
    }

    label::after {
      content: " *";
      color: #ff0000;
    }

    select {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }

  .button-group {
    display: flex;
    justify-content: space-between;
  }
`;

const Error = styled.div`
  color: red;
  font-size: 14px;
  margin-top: -10px;
`;
