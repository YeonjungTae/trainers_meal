import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { IoHome } from "react-icons/io5";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleHome = (): void => navigate("/");

  if (location.pathname == "/") return null;
  if (location.pathname == "/login") return null;
  if (location.pathname == "/register") return null;
  if (location.pathname == "/payment") return null;
  if (location.pathname == "/diet") return null;

  return (
    <Layout>
      <IoHome className="home-button" onClick={handleHome} aria-label="Home" />
    </Layout>
  );
};

export default Header;

const Layout = styled.header`
  position: fixed;
  top: 0;
  width: 100dvw;
  padding: 30px;
  text-align: end;

  .home-button {
    font-size: 35px;
    color: #333634;
  }
`;
