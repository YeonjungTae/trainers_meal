import styled from "styled-components";

interface InfoGroupProps {
  title: string;
  data: { label: string; value: string | number }[];
}

const InfoGroup: React.FC<InfoGroupProps> = ({ title, data }) => {
  return (
    <GroupContainer>
      <h2>{title}</h2>
      {data.map((item, index) => (
        <p key={index}>
          <strong>{item.label}:</strong> {item.value}
        </p>
      ))}
    </GroupContainer>
  );
};

export default InfoGroup;

const GroupContainer = styled.div`
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
`;
