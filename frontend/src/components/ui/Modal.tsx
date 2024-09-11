import styled from "styled-components";
import Button from "./Button";
import { black, white } from "../../styles/color";

interface ModalProps {
  title?: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalOverlay>
      <Container>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="button-wrapper">
          <Button text="취소" onClick={onCancel} color="sub" />
          <Button text="확인" onClick={onConfirm} color="main" />
        </div>
      </Container>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 400px;
  height: 250px;

  padding: 50px 20px;
  background: ${black};
  border-radius: 12px;

  text-align: center;

  h3 {
    color: ${white};
    font-size: 1.5rem;
  }

  p {
    color: ${white};
    font-size: 20px;
  }

  .button-wrapper {
    display: flex;
    justify-content: space-around;
    gap: 15px;
  }
`;

export default Modal;
