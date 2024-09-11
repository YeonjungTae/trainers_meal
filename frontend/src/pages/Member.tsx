import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiClient } from "../api";
import Button from "../components/ui/Button";
import InfoGroup from "../components/ui/InfoGroup";
import Modal from "../components/ui/Modal";

interface MemberProps {
  client_id: string;
  name: string;
  gender: string;
  birthdate: string;
  height: string;
  weight: string;
  muscleMass: string;
  bodyFatMass: string;
  bodyFatPercentage: string;
  activityLevel: string;
  goal: string;
  address: string;
  detailAddress: string;
  deliveryMessage: string;
  entryMethod: string;
  entryPassword: string;
}

const Member = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams<{ id: string }>();
  const [memberDetail, setMemberDetail] = useState<MemberProps | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        const response = await apiClient.get(
          `client/detail?client_id=${clientId}`
        );
        setMemberDetail(JSON.parse(response.data));
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    fetchMemberDetail();
  }, [clientId]);

  if (!memberDetail) {
    return <div>Loading...</div>;
  }

  const personalInfo = [
    { label: "이름", value: memberDetail.name },
    { label: "성별", value: memberDetail.gender },
    { label: "생년월일", value: memberDetail.birthdate },
  ];

  const bodyInfo = [
    { label: "키", value: `${memberDetail.height} cm` },
    { label: "체중", value: `${memberDetail.weight} kg` },
    { label: "골격근량", value: `${memberDetail.muscleMass} kg` },
    { label: "체지방량", value: `${memberDetail.bodyFatMass} kg` },
    { label: "체지방률", value: `${memberDetail.bodyFatPercentage} %` },
  ];

  const goalInfo = [
    { label: "활동 수준", value: memberDetail.activityLevel },
    { label: "목표", value: memberDetail.goal },
  ];

  const deliveryInfo = [
    { label: "주소", value: memberDetail.address },
    { label: "상세 주소", value: memberDetail.detailAddress },
    { label: "배송 메세지", value: memberDetail.deliveryMessage },
    { label: "출입 방법", value: memberDetail.entryMethod },
    ...(memberDetail.entryMethod === "password"
      ? [{ label: "출입 비밀번호", value: memberDetail.entryPassword }]
      : []),
  ];

  const handleEditClick = () => {
    navigate(`/edit/${memberDetail.client_id}`);
  };

  const handleDeleteClick = () => {
    setModalOpen(true);
  };

  // 회원삭제!!!!!!!
  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete(
        `client/delete?client_id=${memberDetail.client_id}`
      );
      setModalOpen(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("회원 삭제에 실패했습니다.");
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
  };

  return (
    <Container>
      <h1>{memberDetail.name}님의 정보</h1>
      <InfoGroup title="개인 정보" data={personalInfo} />
      <InfoGroup title="신체 정보" data={bodyInfo} />
      <InfoGroup title="목표 및 활동 수준" data={goalInfo} />
      <InfoGroup title="배송 정보" data={deliveryInfo} />
      <div className="button-wrapper">
        <Button text="수정하기" onClick={handleEditClick} color="main" />
        <Button text="삭제하기" onClick={handleDeleteClick} color="sub" />
      </div>
      {isModalOpen && (
        <Modal
          description="정말로 삭제하시겠습니까?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </Container>
  );
};

export default Member;

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;

  h1 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 30px;
  }

  .info-group {
    margin-bottom: 20px;

    h2 {
      font-size: 25px;
      margin-bottom: 10px;
    }

    p {
      font-size: 20px;
      margin: 5px 0;
    }

    strong {
      font-weight: bold;
    }
  }

  .button-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
`;
