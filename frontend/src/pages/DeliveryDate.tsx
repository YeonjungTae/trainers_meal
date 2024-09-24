import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { apiClient } from "../api";

const DeliveryDate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    deliveryType: boolean;
    selectedMenus: any[];
    totalPrice: number;
    clientId: string;
  } | null;

  if (!state) {
    alert("잘못된 접근입니다. 처음부터 다시 시도해주세요.");
    navigate("/delivery-pickup");
    return null;
  }

  const isMonday = (date: Date) => date.getDay() === 1;
  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const nextMonday = new Date(today);

    if (!isPastWednesdayCutoff()) {
      nextMonday.setDate(today.getDate() + ((8 - dayOfWeek) % 7));
    } else {
      nextMonday.setDate(today.getDate() + ((15 - dayOfWeek) % 7));
    }

    nextMonday.setHours(0, 0, 0, 0);

    return nextMonday;
  };

  const isPastWednesdayCutoff = () => {
    const now = new Date();
    const isWednesday = now.getDay() === 3;
    const isAfter10PM = now.getHours() >= 22;
    return isWednesday && isAfter10PM;
  };

  const handleDateChange = async (selectedDate: Date) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];

    if (isMonday(selectedDate) && selectedDate >= getNextMonday()) {
      try {
        const response = await apiClient.post("/order/submit/", {
          deliveryType: state.deliveryType,
          deliveryDate: formattedDate,
          selectedMenus: state.selectedMenus,
          totalPrice: state.totalPrice,
          clientId: state.clientId,
        });

        console.log(response.data);

        navigate("/payment", {
          state: {
            totalPrice: state.totalPrice,
            clientId: state.clientId,
            deliveryDate: formattedDate.toString(),
            deliveryType: state.deliveryType,
          },
        });
      } catch (error) {
        console.error("데이터 전송 실패:", error);
        alert("데이터 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("월요일만 선택 가능합니다.");
    }
  };

  return (
    <Container>
      <h1>{state.deliveryType ? "배송일자 선택" : "픽업일자 선택"}</h1>
      <Calendar
        onClickDay={handleDateChange}
        value={getNextMonday()}
        tileDisabled={({ date }) => {
          const nextMonday = getNextMonday();
          const selectedDate = new Date(date);
          selectedDate.setHours(0, 0, 0, 0);

          return (
            !isMonday(date) ||
            selectedDate < nextMonday ||
            (isPastWednesdayCutoff() && selectedDate <= nextMonday)
          );
        }}
        locale="ko-KR"
        calendarType="gregory"
      />
    </Container>
  );
};

export default DeliveryDate;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;

  h1 {
    margin-bottom: 40px;
    font-size: 32px;
    text-align: center;
  }

  .react-calendar {
    width: 100%;
    max-width: 600px;
    background-color: white;
    border: 2px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .react-calendar__navigation button {
    font-size: 24px;
    font-weight: bold;
  }

  .react-calendar__month-view__weekdays__weekday {
    font-size: 20px;
    font-weight: bold;
  }

  .react-calendar__tile--disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }

  .react-calendar__tile {
    height: 80px;
    font-size: 18px;
  }
`;
