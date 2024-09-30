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
  const [memberDetail, setMemberDetail] = useState<MemberProps | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        const response = await apiClient.get(
          `client/detail?client_id=${clientId}&section=${section}`
        );
        setMemberDetail(JSON.parse(response.data));
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    fetchMemberDetail();
  }, [clientId]);

  const handleSave = async (updatedData: Partial<MemberProps>) => {
    try {
      await apiClient.patch(`client/update/`, {
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

  if (!memberDetail) {
    return <div>Loading...</div>;
  }

  const renderSection = () => {
    switch (section) {
      case "personal":
        return (
          <PersonalInfo
            name={memberDetail.name}
            setName={(name) => handleSave({ name })}
            phone={memberDetail.phone}
            setPhone={(phone) => handleSave({ phone })}
            gender={memberDetail.gender}
            setGender={(gender) => handleSave({ gender })}
            birthdate={memberDetail.birthdate}
            setBirthdate={(birthdate) => handleSave({ birthdate })}
          />
        );
      case "physical":
        return (
          <PhysicalInfo
            height={memberDetail.height}
            setHeight={(height) => handleSave({ height })}
            weight={memberDetail.weight}
            setWeight={(weight) => handleSave({ weight })}
            muscleMass={memberDetail.muscleMass}
            setMuscleMass={(muscleMass) => handleSave({ muscleMass })}
            bodyFatMass={memberDetail.bodyFatMass}
            setBodyFatMass={(bodyFatMass) => handleSave({ bodyFatMass })}
            bodyFatPercentage={memberDetail.bodyFatPercentage}
            setBodyFatPercentage={(bodyFatPercentage) =>
              handleSave({ bodyFatPercentage })
            }
          />
        );
      case "goal":
        return (
          <GoalActivityInfo
            activityLevel={memberDetail.activityLevel}
            setActivityLevel={(activityLevel) => handleSave({ activityLevel })}
            goal={memberDetail.goal}
            setGoal={(goal) => handleSave({ goal })}
            notes=""
            setNotes={() => {}}
          />
        );
      case "delivery":
        return (
          <AddressDeliveryInfo
            address={memberDetail.address}
            setAddress={(address) => handleSave({ address })}
            detailAddress={memberDetail.detailAddress}
            setDetailAddress={(detailAddress) => handleSave({ detailAddress })}
            deliveryMessage={memberDetail.deliveryMessage}
            setDeliveryMessage={(deliveryMessage) =>
              handleSave({ deliveryMessage })
            }
            entryMethod={parseInt(memberDetail.entryMethod)}
            setEntryMethod={(entryMethod) =>
              handleSave({ entryMethod: entryMethod.toString() })
            }
            entryPassword={memberDetail.entryPassword}
            setEntryPassword={(entryPassword) => handleSave({ entryPassword })}
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
        <Button text="수정하기" onClick={() => handleSave({})} color="main" />
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
