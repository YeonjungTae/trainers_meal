import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { apiClient } from "../api";
import Button from "../components/ui/Button";

interface MealOption {
  meal_id: string;
  group: string;
}

const Meal: React.FC = () => {
  const [mealCount, setMealCount] = useState<number | null>(null);
  const [mealOptions, setMealOptions] = useState<MealOption[]>([]);
  const [week1Meal1, setWeek1Meal1] = useState<string>("");
  const [week1Meal2, setWeek1Meal2] = useState<string>("");
  const [week2Meal1, setWeek2Meal1] = useState<string>("");
  const [week2Meal2, setWeek2Meal2] = useState<string>("");
  const navigate = useNavigate();
  const clientId = useParams().id;

  useEffect(() => {
    const fetchMealOptions = async () => {
      try {
        const { data } = await apiClient.get("/order/meal/");
        setMealOptions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMealOptions();
  }, []);

  const handleNext = async () => {
    if (mealCount === null) {
      console.log("식사 횟수를 선택하세요.");
      return;
    }

    const selectedMeals = [
      week1Meal1,
      week1Meal2,
      week2Meal1,
      week2Meal2,
    ].filter((mealId) => mealId);

    if (
      (mealCount === 1 && selectedMeals.length !== 2) ||
      (mealCount === 2 && selectedMeals.length !== 4)
    )
      return;

    try {
      await apiClient.post("/order/meal/", {
        clientId,
        mealCount,
        selectedMeals,
      });
      navigate("/diet", {
        state: {
          clientId,
          mealCount,
          selectedMeals,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <h2>식수 및 베이스 메뉴 선택</h2>
      <div className="meal-selection">
        <label>하루 식사 횟수를 선택하세요:</label>
        <div className="card-selection">
          <div
            className={`card ${mealCount === 1 ? "selected" : ""}`}
            onClick={() => setMealCount(1)}
          >
            1식
          </div>
          <div
            className={`card ${mealCount === 2 ? "selected" : ""}`}
            onClick={() => setMealCount(2)}
          >
            2식
          </div>
        </div>
      </div>
      {mealCount !== null && (
        <>
          <div className="menu-selection">
            <label>1주차 1식</label>
            <select
              value={week1Meal1}
              onChange={(e) => setWeek1Meal1(e.target.value)}
            >
              <option value="">메뉴를 선택하세요</option>
              {mealOptions.map((menu) => (
                <option key={menu.meal_id} value={menu.meal_id}>
                  {menu.group}
                </option>
              ))}
            </select>
          </div>
          {mealCount === 2 && (
            <div className="menu-selection">
              <label>1주차 2식</label>
              <select
                value={week1Meal2}
                onChange={(e) => setWeek1Meal2(e.target.value)}
              >
                <option value="">메뉴를 선택하세요</option>
                {mealOptions.map((menu) => (
                  <option key={menu.meal_id} value={menu.meal_id}>
                    {menu.group}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="menu-selection">
            <label>2주차 1식</label>
            <select
              value={week2Meal1}
              onChange={(e) => setWeek2Meal1(e.target.value)}
            >
              <option value="">메뉴를 선택하세요</option>
              {mealOptions.map((menu) => (
                <option key={menu.meal_id} value={menu.meal_id}>
                  {menu.group}
                </option>
              ))}
            </select>
          </div>
          {mealCount === 2 && (
            <div className="menu-selection">
              <label>2주차 2식</label>
              <select
                value={week2Meal2}
                onChange={(e) => setWeek2Meal2(e.target.value)}
              >
                <option value="">메뉴를 선택하세요</option>
                {mealOptions.map((menu) => (
                  <option key={menu.meal_id} value={menu.meal_id}>
                    {menu.group}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
      <Button text="다음" onClick={handleNext} color="main" />
    </Container>
  );
};

export default Meal;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
  }

  .meal-selection {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;

    label {
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 18px;
    }

    .card-selection {
      display: flex;
      gap: 20px;

      .card {
        padding: 15px 30px;
        font-size: 18px;
        border: 1px solid #ccc;
        border-radius: 10px;
        cursor: pointer;
        text-align: center;

        &.selected {
          border-color: #007bff;
          background-color: #007bff;
          color: #fff;
        }
      }
    }
  }

  .menu-selection {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;

    label {
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 18px;
    }

    select {
      padding: 15px;
      font-size: 18px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
  }

  button {
    margin-top: 20px;
    padding: 15px 30px;
    font-size: 18px;
  }
`;
