import styled from "styled-components";

interface InfoGroupProps {
  title: string;
  data: { label: string; value: string | number }[];
  onEditClick?: () => void;
}

const InfoGroup: React.FC<InfoGroupProps> = ({ title, data, onEditClick }) => {
  return (
    <Container>
      <div className="header">
        <h2>{title}</h2>
        {onEditClick && (
          <button className="edit-button" onClick={onEditClick}>
            수정
          </button>
        )}
      </div>
      {data.map((item, index) => (
        <p key={index}>
          <strong>{item.label}:</strong> {item.value}
        </p>
      ))}
    </Container>
  );
};

export default InfoGroup;

const Container = styled.div`
  margin-bottom: 20px;

  p {
    font-size: 20px;
    margin: 5px 0;
  }

  strong {
    font-weight: bold;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h2 {
      font-size: 25px;
      margin: 0;
    }
  }

  .edit-button {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid gray;
    color: gray;
    font-size: 18px;
    cursor: pointer;

    &:hover {
      color: black;
    }
  }
`;
