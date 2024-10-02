import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import userPlaceholder from "../../assets/auth/user.png";
import { sub } from "../../styles/color";

interface User {
  username: string;
  profile: string;
  gym_name: string;
}

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("paymentData");
    localStorage.removeItem("@tosspayments/merchant-browser-id");
    navigate("/login");
  };

  return (
    <Container>
      <div className="card">
        <img src={userPlaceholder} alt={`${user.username}'s profile`} />
        <div className="card-details">
          <div className="info-row">
            <span className="info-label">이름</span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="info-row">
            <span className="info-label">소속</span>
            <span className="info-value">{user.gym_name}</span>
          </div>
          <Button
            className="logout-button"
            onClick={handleLogout}
            text="로그아웃"
          />
        </div>
      </div>
    </Container>
  );
};

export default UserCard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;

  .card {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 350px;
    height: 170px;
    border-radius: 10px;
    background-color: #e0f7fa;
    padding: 25px;

    img {
      border-radius: 10px;
      width: 80px;
      height: 80px;
      object-fit: cover;
      margin-right: 20px;
    }

    .card-details {
      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .info-label {
          font-size: 18px;
          font-weight: bold;
        }

        .info-value {
          font-size: 18px;
          color: #555;
        }
      }

      .logout-button {
        width: 120px;
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
        color: white;
        background: ${sub};
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
`;
