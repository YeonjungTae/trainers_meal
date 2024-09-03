import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import UserCard from "../components/auth/UserCard";
import InputComponent from "../components/ui/InputComponent";
import Button from "../components/ui/Button";
import styled from "styled-components";

interface User {
  username: string;
  profile: string;
  gym_name: string;
}

// 로컬스토리지에서 유저 정보 가져오기
const getLoginTokenFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  return token;
};

// 로컬스토리지에서 유저 정보 가져오기
const getUserDataFromLocalStorage = () => {
  const userData = localStorage.getItem("user");
  return userData;
};

// 트레이너에 해당하는 모든 클라이언트 리스트 가져오기
const getClients = async (token: string | null) => {
  try {
    const response = await apiClient.get(`/client/list?token=${token}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

const Home: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<User>();
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const tokenData = getLoginTokenFromLocalStorage();
        try {
          await apiClient.get(`/check_token/?token=${tokenData}`);
        } catch (error) {
          alert("토큰이 만료되었습니다.");
          navigate(`/login`);
        }

        if (!tokenData) {
          console.log("No login info found in localStorage");
          navigate(`/login`);
        }

        const userData = getUserDataFromLocalStorage();
        setUserInfo(JSON.parse(userData || ""));

        const clientsData = await getClients(tokenData);

        const processedClients = clientsData.map((client: any) => ({
          ...client,
          isSubscribed: client.is_subscribed ?? false,
          isPaused: client.is_paused ?? false,
        }));

        setAllMembers(processedClients);
        setFilteredMembers(processedClients);
        console.log("Clients Data:", processedClients);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setFilterStatus(status);
    filterMembers(status, searchTerm);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterMembers(filterStatus, term);
  };

  const filterMembers = (status: string, term: string) => {
    let filtered = allMembers;

    if (status) {
      if (status === "Active") {
        filtered = filtered.filter((member) => member.isSubscribed);
      } else if (status === "Paused") {
        filtered = filtered.filter((member) => member.isPaused);
      } else if (status === "Inactive") {
        filtered = filtered.filter(
          (member) => !member.isSubscribed && !member.isPaused
        );
      }
    }

    if (term) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(term.toLowerCase()) ||
          member.goal.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  };

  const handleOrderClick = (clientId: string) => {
    navigate(`/bia/${clientId}`);
  };

  const handleMemberClick = (clientId: string) => {
    navigate(`/member/${clientId}`);
  };

  const handleAddMember = () => {
    navigate(`/add`);
  };

  return (
    <Container>
      {userInfo && <UserCard user={{ ...userInfo }} />}{" "}
      <div className="filter-search-bar">
        <select value={filterStatus} onChange={handleFilterChange}>
          <option value="">모두</option>
          <option value="Active">구독중</option>
          <option value="Paused">구독중단</option>
          <option value="Inactive">구독안함</option>
        </select>
        <InputComponent
          type="text"
          placeholder="회원명을 입력하세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button
          text="등록"
          onClick={handleAddMember}
          color="main"
          className="add-member-button"
        />
      </div>
      <div className="table-container">
        <table className="member-table">
          <thead>
            <tr>
              <th>구독상태</th>
              <th>이름</th>
              <th>성별</th>
              <th>목표</th>
              <th>주문하기</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr
                key={member.client_id}
                onClick={() => handleMemberClick(member.client_id)}
              >
                <td>
                  <div
                    className={`status-indicator ${
                      member.isSubscribed
                        ? "Active"
                        : member.isPaused
                        ? "Paused"
                        : "Inactive"
                    }`}
                  />
                </td>
                <td>{member.name}</td>
                <td>{member.gender === 0 ? "남" : "여"}</td>
                <td>{member.goal}</td>
                <td>
                  <Button
                    text="처방"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderClick(member.client_id);
                    }}
                    className="order-button"
                    color="main"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .filter-search-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;

    select,
    input {
      padding: 10px;
      font-size: 16px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    input {
      flex: 1;
    }

    .add-member-button {
      padding: 10px 20px;
      font-size: 16px;
      margin-left: 10px;
    }
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
    border-radius: 5px;
  }

  .member-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 10px;
      text-align: left;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }

    th {
      background-color: #f4f4f4;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    tbody tr {
      cursor: pointer;
      border-bottom: 1px solid #ccc;

      &:hover {
        background-color: #f1f1f1;
      }
    }

    .order-button {
      width: 60px;
      height: 30px;
      padding: 5px 10px;
      font-size: 12px;
    }
  }

  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &.Active {
      background-color: green;
    }

    &.Paused {
      background-color: orange;
    }

    &.Inactive {
      background-color: red;
    }
  }
`;
