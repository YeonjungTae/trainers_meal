import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiClient } from "../api";
import Button from "../components/ui/Button";
import PersonalInfo from "../components/member/PersonalInfo";
import PhysicalInfo from "../components/member/PhysicalInfo";
import GoalActivityInfo from "../components/member/GoalActivityInfo";
import AddressDeliveryInfo from "../components/member/AddressDeliveryInfo";

interface MemberProps {
  client_id: string;
  name: string;
  phone: string;
  gender: string;
  birthdate: string;
  height: string;
  weight: string;
  muscleMass: string;
  bodyFatMass: string;
  bodyFatPercentage: string;
  activityLevel: string;
  goal: string;
  memo: string;
  address: string;
  detailAddress: string;
  deliveryMessage: string;
  entryMethod: string;
  entryPassword: string;
}

const EditMember = () => {
  const { id: clientId, section } = useParams<{
    id: string;
    section: string;
  }>();
  const [memberDetail, setMemberDetail] = useState<MemberProps>({
    client_id: "",
    name: "",
    phone: "",
    gender: "",
    birthdate: "",
    height: "",
    weight: "",
    muscleMass: "",
    bodyFatMass: "",
    bodyFatPercentage: "",
    activityLevel: "",
    goal: "",
    memo: "",
    address: "",
    detailAddress: "",
    deliveryMessage: "",
    entryMethod: "",
    entryPassword: "",
  });
  const [updatedData, setUpdatedData] = useState<Partial<MemberProps>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        const response = await apiClient.get(
          `/client/edit?client_id=${clientId}&section=${section}`
        );
        setMemberDetail(JSON.parse(response.data));
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    fetchMemberDetail();
  }, [clientId, section]);

  const handleSave = async () => {
    try {
      await apiClient.patch(`/client/edit/`, {
        section,
        ...memberDetail,
        ...updatedData,
      });
      alert("회원 정보가 성공적으로 업데이트되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (field: keyof MemberProps, value: string) => {
    setUpdatedData({
      ...updatedData,
      [field]: value,
    });
  };

  if (!memberDetail) {
    return <div>Loading...</div>;
  }

  const renderSection = () => {
    switch (section) {
      case "personal":
        return (
          <PersonalInfo
            name={updatedData.name || memberDetail.name || ""}
            setName={(name) => handleChange("name", name)}
            phone={updatedData.phone || memberDetail.phone || ""}
            setPhone={(phone) => handleChange("phone", phone)}
            gender={updatedData.gender || memberDetail.gender || ""}
            setGender={(gender) => handleChange("gender", gender)}
            birthdate={updatedData.birthdate || memberDetail.birthdate || ""}
            setBirthdate={(birthdate) => handleChange("birthdate", birthdate)}
          />
        );
      case "physical":
        return (
          <PhysicalInfo
            height={updatedData.height || memberDetail.height || ""}
            setHeight={(height) => handleChange("height", height)}
            weight={updatedData.weight || memberDetail.weight || ""}
            setWeight={(weight) => handleChange("weight", weight)}
            muscleMass={updatedData.muscleMass || memberDetail.muscleMass || ""}
            setMuscleMass={(muscleMass) =>
              handleChange("muscleMass", muscleMass)
            }
            bodyFatMass={
              updatedData.bodyFatMass || memberDetail.bodyFatMass || ""
            }
            setBodyFatMass={(bodyFatMass) =>
              handleChange("bodyFatMass", bodyFatMass)
            }
            bodyFatPercentage={
              updatedData.bodyFatPercentage ||
              memberDetail.bodyFatPercentage ||
              ""
            }
            setBodyFatPercentage={(bodyFatPercentage) =>
              handleChange("bodyFatPercentage", bodyFatPercentage)
            }
          />
        );
      case "goal":
        return (
          <GoalActivityInfo
            activityLevel={
              updatedData.activityLevel || memberDetail.activityLevel || ""
            }
            setActivityLevel={(activityLevel) =>
              handleChange("activityLevel", activityLevel)
            }
            goal={updatedData.goal || memberDetail.goal || ""}
            setGoal={(goal) => handleChange("goal", goal)}
            notes={updatedData.memo || memberDetail.memo || ""}
            setNotes={(memo) => handleChange("memo", memo)}
          />
        );
      case "delivery":
        return (
          <AddressDeliveryInfo
            address={updatedData.address || memberDetail.address || ""}
            setAddress={(address) => handleChange("address", address)}
            detailAddress={
              updatedData.detailAddress || memberDetail.detailAddress || ""
            }
            setDetailAddress={(detailAddress) =>
              handleChange("detailAddress", detailAddress)
            }
            deliveryMessage={
              updatedData.deliveryMessage || memberDetail.deliveryMessage || ""
            }
            setDeliveryMessage={(deliveryMessage) =>
              handleChange("deliveryMessage", deliveryMessage)
            }
            entryMethod={updatedData.entryMethod || memberDetail.entryMethod}
            setEntryMethod={(entryMethod) =>
              handleChange("entryMethod", entryMethod)
            }
            entryPassword={
              updatedData.entryPassword || memberDetail.entryPassword || ""
            }
            setEntryPassword={(entryPassword) =>
              handleChange("entryPassword", entryPassword)
            }
          />
        );
      default:
        return <div>잘못된 섹션입니다.</div>;
    }
  };

  return (
    <Container>
      <h1>회원 정보 수정</h1>
      {renderSection()}
      <div className="button-wrapper">
        <Button text="취소하기" onClick={() => navigate(-1)} color="sub" />
        <Button text="수정하기" onClick={handleSave} color="main" />
      </div>
    </Container>
  );
};

export default EditMember;

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;

  h1 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 30px;
  }

  .button-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
`;
