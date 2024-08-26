import { useLocation } from "react-router-dom";
import uuid from 'react-uuid'
import styled from "styled-components";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const Toss: React.FC = () => {
  const location = useLocation();

  const state = location.state as {
    totalPrice: number;
    clientId?: string;
    deliveryDate?: string;
    deliveryType?: string;
  } | null;

  // state가 없거나 필수 데이터가 없을 경우 처리
  if (!state || !state.clientId) {
    alert("잘못된 접근입니다. 처음부터 다시 시도해주세요.");
    return null;
  }

  const clientKey = "live_gck_Z1aOwX7K8myOK7pQMNXQ8yQxzvNP";
  const customerKey = state?.clientId;
  const orderId = uuid();

  const [amount] = useState({
    currency: "KRW",
    value: state?.totalPrice,
  });

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>();

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey,
      });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <Container>
      <div className="wrapper">
        <div className="box_section">
          {/* 결제 UI */}
          <div id="payment-method" />
          {/* 이용약관 UI */}
          <div id="agreement" />
          <div className="button-wrapper">
            {/* 결제하기 버튼 */}
            <button
              className="button"
              disabled={!ready}
              onClick={async () => {
                try {
                  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                  // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
                  // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
                  await widgets.requestPayment({
                    orderId: orderId,
                    orderName: "트레이너스밀 결제",
                    successUrl: window.location.origin + "/confirm?clientId=" + state.clientId + "&deliveryDate=" + state.deliveryDate + "&deliveryType=" + state.deliveryType,
                    failUrl: window.location.origin + "/fail",
                  });
                } catch (error) {
                  // 에러 처리하기
                  console.error(error);
                }
              }}
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Toss;

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