import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../api";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    totalPrice: number;
    clientId?: string;
    deliveryDate: string;
    deliveryType: string;
  } | null;

  if (!state || !state.clientId) {
    alert("잘못된 접근입니다. 처음부터 다시 시도해주세요.");
    return null;
  }

  const { totalPrice, clientId } = state;

  const handleConfirmPayment = async () => {
    try {
      await apiClient.post("/payment/", {
        clientId,
        totalPrice,
        deliveryDate: state?.deliveryDate,
        deliveryType: state?.deliveryType,
      });
      navigate("/");
    } catch (error) {
      console.error("결제 실패:", error);
    }
  };

  handleConfirmPayment();

};

export default PaymentSuccess;

