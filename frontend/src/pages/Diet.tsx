import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiClient } from "../api";
import Button from "../components/ui/Button";
import { main, sub } from "../styles/color";

interface MenuItem {
  id: string;
  day: string;
  menu_name: string;
  nutrients: {
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    sodium: number;
    sugar: number;
  };
  block: {
    base: { id: string; name: string };
    protein: { id: string; name: string };
    veg: { id: string; name: string };
    flavor: { id: string; name: string };
  };
  add_block?: {
    protein1?: { id: string; name: string };
    protein2?: { id: string; name: string };
    veg1?: { id: string; name: string };
    veg2?: { id: string; name: string };
    flavor?: { id: string; name: string };
  };
}

const Diet: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    clientId: string;
    mealCount: number;
    selectedMeals: string[];
    updatedMenu?: MenuItem;
    totalPrice?: number;
  } | null;

  const mealCount = state?.mealCount ?? 1;
  const [selectedMenus, setSelectedMenus] = useState<MenuItem[][]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(state?.totalPrice || 0);

  // 요일 숫자를 요일 이름으로 변환하는 함수
  const getDayName = (day: number | string): string => {
    const days = ["월", "화", "수", "목", "금", "토"];
    const dayIndex = typeof day === "string" ? parseInt(day, 10) : day;
    return !isNaN(dayIndex) && dayIndex >= 0 && dayIndex <= 5
      ? days[dayIndex]
      : "Invalid Day";
  };

  // 메뉴를 가져오는 함수
  const fetchMenus = async () => {
    try {
      const response = await apiClient.get(
        `/order/list?clientId=${state?.clientId}`
      );
      const menus = JSON.parse(response.data);

      if (Array.isArray(menus)) {
        setSelectedMenus((prevMenus) => {
          const updatedMenus = [...prevMenus];
          updatedMenus[activeTab] = menus[activeTab];
          return updatedMenus;
        });

        // 서버에서 총 금액을 받아오는 경우 설정
        if (menus[0][0]['totalPrice']) {
          setTotalPrice(menus[0][0]['totalPrice']);
        } else {
          setTotalPrice(0);
        }

        console.log(`Menus for meal ${activeTab} fetched successfully:`, menus);
      } else {
        console.error("Fetched menus is not an array:", menus);
      }
    } catch (error) {
      console.error(`Failed to fetch menus for meal ${activeTab}:`, error);
      setTotalPrice(0);
      alert("메뉴 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (state?.updatedMenu) {
      setSelectedMenus((prevMenus) => {
        const updatedMenus = [...prevMenus];
        const menuIndex = prevMenus[activeTab].findIndex(
          (menu) => menu.id === state.updatedMenu?.id
        );
        if (menuIndex !== -1) {
          updatedMenus[activeTab][menuIndex] = state.updatedMenu!;
        }
        return updatedMenus;
      });
    } else if (state?.selectedMeals) {
      fetchMenus();
    }
  }, [activeTab, state?.selectedMeals, state?.updatedMenu]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    fetchMenus();
  };

  const handleOptionClick = (tabIndex: number, menuIndex: number) => {
    const selectedMenu = selectedMenus[tabIndex][menuIndex];

    navigate(`/option/${menuIndex}`, {
      state: {
        tabIndex,
        menuIndex,
        mealId: state?.selectedMeals,
        clientId: state?.clientId,
        menuId: selectedMenu.id,
        menuName: selectedMenu.menu_name,
        blockIds: {
          base: selectedMenu.block?.base.id,
          protein: selectedMenu.block?.protein.id,
          veg: selectedMenu.block?.veg.id,
          flavor: selectedMenu.block?.flavor.id,
        },
        addBlockIds: {
          protein1: selectedMenu.add_block?.protein1?.id,
          protein2: selectedMenu.add_block?.protein2?.id,
          veg1: selectedMenu.add_block?.veg1?.id,
          veg2: selectedMenu.add_block?.veg2?.id,
          flavor: selectedMenu.add_block?.flavor?.id,
        },
      },
    });
  };

  const handleOrder = () => {
    navigate("/delivery-pickup", {
      state: {
        clientId: state?.clientId,
        selectedMenus,
        totalPrice,
      },
    });
  };

  return (
    <Container>
      <div className="tabs">
        {state?.selectedMeals.map((_, index) => (
          <div
            key={index}
            className={`tab ${activeTab === index ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
          >
            {Math.ceil((index + 1) / mealCount)}주차 {(index % mealCount) + 1}식
          </div>
        ))}
      </div>
      <div className="option-list">
        {(selectedMenus[activeTab] || []).map((menu, menuIndex) => (
          <div
            key={menuIndex}
            className="option"
            onClick={() => handleOptionClick(activeTab, menuIndex)}
          >
            <div className="day-and-menu">
              <span className="day-name">{getDayName(menu.day)}</span>
              <span className="menu-name">{menu.menu_name}</span>
            </div>
            <div className="option-details">
              <div className="block-info">
                {/* 예시: 블록 정보 표시 */}
                {menu.block && (
                  <>
                    <p>베이스 블록: {menu.block.base.name}</p>
                    <p>단백질 블록: {menu.block.protein.name}</p>
                    <p>채소 블록: {menu.block.veg.name}</p>
                    <p>플레이버 블록: {menu.block.flavor.name}</p>
                  </>
                )}
              </div>
              <div className="add-info">
                {/* 예시: 추가 블록 정보 표시 */}
                {menu.add_block && (
                  <>
                    {menu.add_block.protein1 && (
                      <p>✚ 추가 단백질 블록1: {menu.add_block.protein1.name}</p>
                    )}
                    {menu.add_block.protein2 && (
                      <p>✚ 추가 단백질 블록2: {menu.add_block.protein2.name}</p>
                    )}
                    {menu.add_block.veg1 && (
                      <p>✚ 추가 채소 블록1: {menu.add_block.veg1.name}</p>
                    )}
                    {menu.add_block.veg2 && (
                      <p>✚ 추가 채소 블록2: {menu.add_block.veg2.name}</p>
                    )}
                    {menu.add_block.flavor && (
                      <p>✚ 추가 플레이버 블록: {menu.add_block.flavor.name}</p>
                    )}
                  </>
                )}
              </div>
              <div className="nutrients">
                <div className="nutrient-item">
                  <span className="nutrient-name">칼로리</span>
                  <span className="nutrient-value">
                    {menu.nutrients.calories} kcal
                  </span>
                </div>
                <div className="nutrient-item">
                  <span className="nutrient-name">탄수화물</span>
                  <span className="nutrient-value">
                    {menu.nutrients.carbohydrate} g
                  </span>
                </div>
                <div className="nutrient-item">
                  <span className="nutrient-name">단백질</span>
                  <span className="nutrient-value">
                    {menu.nutrients.protein} g
                  </span>
                </div>
                <div className="nutrient-item">
                  <span className="nutrient-name">지방</span>
                  <span className="nutrient-value">{menu.nutrients.fat} g</span>
                </div>
                <div className="nutrient-item">
                  <span className="nutrient-name">나트륨</span>
                  <span className="nutrient-value">
                    {menu.nutrients.sodium} mg
                  </span>
                </div>
                <div className="nutrient-item">
                  <span className="nutrient-name">당</span>
                  <span className="nutrient-value">
                    {menu.nutrients.sugar} g
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="button-wrapper">
        <div className="total-price">{totalPrice.toLocaleString()}원</div>
        <Button text="주문하기" onClick={handleOrder} color="main" />
      </div>
    </Container>
  );
};

export default Diet;

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

  .tabs {
    display: flex;
    width: 100%;
    overflow-x: auto;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;

    .tab {
      flex: 1;
      padding: 15px;
      text-align: center;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: border-color 0.3s ease;
      background-color: white;
      &:hover {
        background-color: #e9e9e9;
      }

      &.active {
        border-color: #007bff;
        font-weight: bold;
      }
    }
  }

  .option-list {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
  }

  .option {
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }

    .day-and-menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .day-name {
        font-size: 20px;
        font-weight: bold;
        color: ${main};
      }

      .menu-name {
        font-size: 20px;
        font-weight: bold;
        color: #333;
      }
    }

    .option-details {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 20px;

      .block-info,
      .add-info,
      .nutrients {
        flex: 1;
        font-size: 16px;
        color: #333;

        .nutrient-item {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 2px;
          color: #666;

          .nutrient-name {
            margin-right: 2px;
            text-align: left;
            flex: 0.3;
          }

          .nutrient-value {
            text-align: right;
            flex: 0.4;
          }
        }
      }
    }
  }

  .button-wrapper {
    width: 100%;
    padding: 20px;
    background: white;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    position: sticky;
    bottom: 0;
    left: 0;

    .total-price {
      font-size: 18px;
      font-weight: bold;
      color: ${sub};
    }

    button {
      padding: 15px 30px;
      font-size: 18px;
    }
  }
`;
