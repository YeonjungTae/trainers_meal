import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { apiClient } from "../api";

// 로컬스토리지에서 결제 정보 가져오기
const getPaymentDataFromLocalStorage = () => {
  const paymentData = localStorage.getItem("paymentData");
  return paymentData;
};

const NormalPaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [clientId, setClientId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryType, setDeliveryType] = useState<string>("");

  const requestData = {
    orderId: searchParams.get("orderId"),
    amount: searchParams.get("amount"),
    paymentKey: searchParams.get("paymentKey"),
  };

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        // 로컬 스토리지에서 결제 정보 가져오기
        const paymentData = getPaymentDataFromLocalStorage();

        setClientId(JSON.parse(paymentData || '').clientId);
        setOrderId(requestData.orderId || '');
        setAmount(requestData.amount || '');
        setDeliveryDate(JSON.parse(paymentData || '').deliveryDate);
        setDeliveryType(JSON.parse(paymentData || '').deliveryType);

        console.log("Payment Data:", paymentData);

        // if (amount !== requestData.amount) {
        //   navigate(`/normal-payment/fail?message=${response.statusText}&code=${response.status}`);
        //   return;
        // }

        console.log(requestData.paymentKey,amount, orderId)

        const response = await apiClient.post("/order/confirm/", {
          orderId: requestData.orderId,
          amount: requestData.amount,
          paymentKey: requestData.paymentKey,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPaymentInfo();
  }, []);


  //   // 결제를 승인하면 결제수단에서 금액이 차감돼요.
  //   got
  //     .post("https://api.tosspayments.com/v1/payments/confirm", {
  //       headers: {
  //         Authorization: encryptedSecretKey,
  //         "Content-Type": "application/json",
  //       },
  //       json: {
  //         orderId: orderId,
  //         amount: amount,
  //         paymentKey: paymentKey,
  //       },
  //       responseType: "json",
  //     })
  //     .then(function (response: any) {
  //       // 결제 성공 비즈니스 로직을 구현하세요.
  //       console.log(response.body);
  //       res.status(response.statusCode).json(response.body)
  //     })
  //     .catch(function (error: any) {
  //       // 결제 실패 비즈니스 로직을 구현하세요.
  //       console.log(error.response.body);
  //       res.status(error.response.statusCode).json(error.response.body)
  //     });
  // });

  // app.listen(4242, () =>
  //   console.log(`http://localhost:${4242} 으로 샘플 앱이 실행되었습니다.`)
  // );

  return (
    <Container>
      <div className="result wrapper">
        <div className="box_section">
          <h2>
            결제 성공
          </h2>
          <p>{`주문번호: ${orderId}`}</p>
          <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
          <p>{`paymentKey: ${requestData.paymentKey}`}</p>
        </div>
      </div>
    </Container>
  );
};

export default NormalPaymentSuccess;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  box-sizing: border-box;
  background-color: #f5f5f5;

  .wrapper {
    width: 100%;
  }
  
  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;

    button {
      padding: 10px 20px;
      font-size: 18px;
      color: white;
      background-color: #007bff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
`;