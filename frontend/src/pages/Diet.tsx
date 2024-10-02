import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import styled from "styled-components";
import { MenuItem } from "../types";
import BlockInfo from "../components/menu/BlockInfo";
import Nutrients from "../components/menu/Nutrients";
import AddBlockInfo from "../components/menu/AddBlockInfo";
import Button from "../components/ui/Button";
import { main, sub } from "../styles/color";

const GET_DAY = (day: number | string): string => {
  const days = ["월", "화", "수", "목", "금", "토"];
  const dayIndex = typeof day === "string" ? parseInt(day, 10) : day;
  return !isNaN(dayIndex) && dayIndex >= 0 && dayIndex <= 5
    ? days[dayIndex]
    : "Invalid Day";
};

const Diet: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    clientId: string;
    mealCount: number;
    selectedMeals: string[];
    updatedMenu?: MenuItem;
    totalPrice?: number;
    activeTab?: number;
  } | null;

  const mealCount = state?.mealCount ?? 1;
  const [selectedMenus, setSelectedMenus] = useState<MenuItem[][]>([]);
  const [activeTab, setActiveTab] = useState<number>(state?.activeTab || 0);
  const [totalPrice, setTotalPrice] = useState<number>(state?.totalPrice || 0);

  const updateMenus = (menus: MenuItem[][]) => {
    setSelectedMenus((prevMenus) => {
      const updatedMenus = [...prevMenus];
      updatedMenus[activeTab] = menus[activeTab];
      return updatedMenus;
    });

    setTotalPrice(menus[0][0]?.totalPrice || 0);
  };

  const fetchMenus = async () => {
    try {
      const { data } = await apiClient.get(
        `/order/register?clientId=${state?.clientId}`
      );
      const menus = JSON.parse(data);
      if (Array.isArray(menus)) {
        updateMenus(menus);
      }
    } catch (error) {
      console.error(error);
      setTotalPrice(0);
    }
  };

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
              <span className="day-name">{GET_DAY(menu.day)}</span>
              <span className="menu-name">{menu.menu_name}</span>
            </div>
            <div className="option-details">
              <BlockInfo block={menu.block} />
              <AddBlockInfo addBlock={menu.add_block} />
              <Nutrients nutrients={menu.nutrients} />
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
  width: 100dvw;
  height: 100dvh;
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
      cursor: pointer;
      border-bottom: 4px solid transparent;
      background-color: white;
      font-size: 20px;
      text-align: center;
      transition: border-color 0.3s ease;

      &.active {
        border-color: ${main};
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
