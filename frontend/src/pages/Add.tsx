import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import PersonalInfo from "../components/member/PersonalInfo";
import PhysicalInfo from "../components/member/PhysicalInfo";
import GoalActivityInfo from "../components/member/GoalActivityInfo";
import AddressDeliveryInfo from "../components/member/AddressDeliveryInfo";
import styled from "styled-components";

const getLoginTokenFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  return token;
};

const Add: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [muscleMass, setMuscleMass] = useState<string>("");
  const [bodyFatMass, setBodyFatMass] = useState<string>("");
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("2");
  const [goal, setGoal] = useState<string>("3");
  const [notes, setNotes] = useState<string>("");
  const [deliveryMessage, setDeliveryMessage] = useState<string>("");
  const [entryMethod, setEntryMethod] = useState<string>("1");
  const [entryPassword, setEntryPassword] = useState<string>("");
  const tokenData = getLoginTokenFromLocalStorage();
  const navigate = useNavigate();

  const submitForm = async () => {
    const formData: any = {
      tokenData,
      name,
      phone,
      gender,
      birthdate,
      height,
      weight,
      goal,
      activityLevel,
    };

    if (muscleMass) formData.muscleMass = muscleMass;
    if (bodyFatMass) formData.bodyFatMass = bodyFatMass;
    if (bodyFatPercentage) formData.bodyFatPercentage = bodyFatPercentage;
    if (notes) formData.notes = notes;
    if (address) formData.address = address;
    if (detailAddress) formData.detailAddress = detailAddress;
    if (deliveryMessage) formData.deliveryMessage = deliveryMessage;
    if (entryMethod !== null) formData.entryMethod = entryMethod;
    if (entryMethod === "0" && entryPassword)
      formData.entryPassword = entryPassword;

    try {
      const { data } = await apiClient.post("/client/edit/", formData);
      console.log(data);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfo
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            gender={gender}
            setGender={setGender}
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <PhysicalInfo
            height={height}
            setHeight={setHeight}
            weight={weight}
            setWeight={setWeight}
            muscleMass={muscleMass}
            setMuscleMass={setMuscleMass}
            bodyFatMass={bodyFatMass}
            setBodyFatMass={setBodyFatMass}
            bodyFatPercentage={bodyFatPercentage}
            setBodyFatPercentage={setBodyFatPercentage}
            onNext={() => setStep(3)}
            onPrevious={() => setStep(1)}
          />
        );
      case 3:
        return (
          <GoalActivityInfo
            activityLevel={activityLevel}
            setActivityLevel={setActivityLevel}
            goal={goal}
            setGoal={setGoal}
            notes={notes}
            setNotes={setNotes}
            onNext={() => setStep(4)}
            onPrevious={() => setStep(2)}
          />
        );
      case 4:
        return (
          <AddressDeliveryInfo
            address={address}
            setAddress={setAddress}
            detailAddress={detailAddress}
            setDetailAddress={setDetailAddress}
            deliveryMessage={deliveryMessage}
            setDeliveryMessage={setDeliveryMessage}
            entryMethod={entryMethod}
            setEntryMethod={setEntryMethod}
            entryPassword={entryPassword}
            setEntryPassword={setEntryPassword}
            onRegister={submitForm}
            onPrevious={() => setStep(3)}
          />
        );
      default:
        return null;
    }
  };

  return <Container>{renderStep()}</Container>;
};

export default Add;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    text-align: center;
  }
`;
