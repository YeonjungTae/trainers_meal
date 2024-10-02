import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api";
import styled from "styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import Button from "../components/ui/Button";
import { main } from "../styles/color";

interface OptionBlock {
  id: string;
  block_name: string;
  difference?: number;
  price?: number;
  is_default?: boolean;
}

const Option: React.FC = () => {
  const location = useLocation();
  const state = location.state as {
    clientId: string;
    mealId: string;
    tabIndex: number;
    menuIndex: number;
    menuId: string;
    menuName: string;
    blockIds: {
      base?: string;
      protein?: string;
      veg?: string;
      flavor?: string;
    };
    addBlockIds?: {
      protein1?: string;
      protein2?: string;
      veg1?: string;
      veg2?: string;
      flavor?: string;
    };
  } | null;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [baseOptions, setBaseOptions] = useState<OptionBlock[]>([]);
  const [proteinOptions, setProteinOptions] = useState<OptionBlock[]>([]);
  const [vegOptions, setVegOptions] = useState<OptionBlock[]>([]);
  const [flavorOptions, setFlavorOptions] = useState<OptionBlock[]>([]);

  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedProtein, setSelectedProtein] = useState<string>("");
  const [selectedVeg, setSelectedVeg] = useState<string>("");
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");

  const [additionalProtein, setAdditionalProtein] = useState<string[]>([]);
  const [additionalVeg, setAdditionalVeg] = useState<string[]>([]);
  const [additionalFlavor, setAdditionalFlavor] = useState<string[]>([]);

  const [defaultCost, setDefaultCost] = useState<number>(0);
  const [addedCost, setAddedCost] = useState<number>(0);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await apiClient.get(
          `/order/option/?mealId=${state?.mealId}&tabIndex=${state?.tabIndex}&day=${state?.menuIndex}`
        );
        const data = JSON.parse(response.data);

        setBaseOptions(data.base || []);
        setProteinOptions(data.protein || []);
        setVegOptions(data.veg || []);
        setFlavorOptions(data.flavor || []);

        setSelectedBase(state?.blockIds?.base || data.base[0].id);
        setSelectedProtein(state?.blockIds?.protein || data.protein[0].id);
        setSelectedVeg(state?.blockIds?.veg || data.veg[0].id);
        setSelectedFlavor(state?.blockIds?.flavor || data.flavor[0].id);

        setAdditionalProtein(
          [state?.addBlockIds?.protein1, state?.addBlockIds?.protein2].filter(
            Boolean
          ) as string[]
        );
        setAdditionalVeg(
          [state?.addBlockIds?.veg1, state?.addBlockIds?.veg2].filter(
            Boolean
          ) as string[]
        );
        setAdditionalFlavor(
          [state?.addBlockIds?.flavor].filter(Boolean) as string[]
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchOptions();
  }, [id]);

  useEffect(() => {
    const selectedBasePrice =
      baseOptions.find((opt) => opt.id === selectedBase)?.difference || 0;
    const selectedProteinPrice =
      proteinOptions.find((opt) => opt.id === selectedProtein)?.difference || 0;
    const selectedVegPrice =
      vegOptions.find((opt) => opt.id === selectedVeg)?.difference || 0;
    const selectedFlavorPrice =
      flavorOptions.find((opt) => opt.id === selectedFlavor)?.difference || 0;

    const additionalProteinPrice = additionalProtein.reduce((acc, id) => {
      const option = proteinOptions.find((opt) => opt.id === id);
      return acc + Math.max((option?.price ?? 0) - 300, 0);
    }, 0);

    const additionalVegPrice = additionalVeg.reduce((acc, id) => {
      const option = vegOptions.find((opt) => opt.id === id);
      return acc + Math.max((option?.price ?? 0) - 300, 0);
    }, 0);

    const additionalFlavorPrice = additionalFlavor.reduce((acc, id) => {
      const option = flavorOptions.find((opt) => opt.id === id);
      return acc + Math.max((option?.price ?? 0) - 100, 0);
    }, 0);

    setAddedCost(
      selectedBasePrice +
        selectedProteinPrice +
        selectedVegPrice +
        selectedFlavorPrice +
        additionalProteinPrice +
        additionalVegPrice +
        additionalFlavorPrice
    );

    setDefaultCost(addedCost);
  }, [
    selectedBase,
    selectedProtein,
    selectedVeg,
    selectedFlavor,
    additionalProtein,
    additionalVeg,
    additionalFlavor,
    baseOptions,
    proteinOptions,
    vegOptions,
    flavorOptions,
  ]);

  const handleAdditionalChange = (
    optionType: "protein" | "veg" | "flavor",
    id: string
  ) => {
    if (optionType === "flavor" && additionalFlavor.length >= 1) {
      if (additionalFlavor.includes(id)) {
        setAdditionalFlavor((prev) => prev.filter((item) => item !== id));
      } else {
        alert("추가 소스는 최대 1개만 선택할 수 있습니다.");
      }
      return;
    }

    const combinedCount = additionalProtein.length + additionalVeg.length;
    if (optionType !== "flavor" && combinedCount >= 2) {
      if (
        (optionType === "protein" && additionalProtein.includes(id)) ||
        (optionType === "veg" && additionalVeg.includes(id))
      ) {
        if (optionType === "protein") {
          setAdditionalProtein((prev) => prev.filter((item) => item !== id));
        } else {
          setAdditionalVeg((prev) => prev.filter((item) => item !== id));
        }
      } else {
        alert("추가 단백질과 채소는 합쳐서 최대 2개만 선택할 수 있습니다.");
      }
      return;
    }

    const setOption =
      optionType === "protein"
        ? setAdditionalProtein
        : optionType === "veg"
        ? setAdditionalVeg
        : setAdditionalFlavor;

    setOption((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await apiClient.post(`/order/option/`, {
        clientId: state?.clientId,
        tabIndex: state?.tabIndex,
        menuIndex: state?.menuIndex,
        menuId: state?.menuId,
        menuName: state?.menuName,
        selectedBase,
        selectedProtein,
        selectedVeg,
        selectedFlavor,
        additionalProtein,
        additionalVeg,
        additionalFlavor,
        defaultCost,
        addedCost,
      });

      navigate("/diet", {
        state: {
          clientId: state?.clientId,
          selectedMeals: state?.mealId,
          activeTab: state?.tabIndex,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/diet", {
      state: {
        clientId: state?.clientId,
        selectedMeals: state?.mealId,
        activeTab: state?.tabIndex,
      },
    });
  };

  return (
    <Container>
      <div className="header">
        <div className="back-button" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>
        <h1 className="title">{state?.menuName}</h1>
      </div>
      <div className="content">
        <div className="section-left">
          <div className="option-section">
            <h2 className="option-title">
              베이스 <span className="required">필수</span>
            </h2>
            {Array.isArray(baseOptions) &&
              baseOptions.map((option) => (
                <div className="option-item" key={option.id}>
                  <input
                    type="radio"
                    id={`base-${option.id}`}
                    name="base"
                    value={option.id}
                    checked={selectedBase === option.id}
                    onChange={() => setSelectedBase(option.id)}
                  />
                  <label htmlFor={`base-${option.id}`}>
                    {option.block_name} (+{option.difference}원)
                  </label>
                </div>
              ))}
          </div>

          <div className="option-section">
            <h2 className="option-title">
              단백질 <span className="required">필수</span>
            </h2>
            {Array.isArray(proteinOptions) &&
              proteinOptions.map((block) => (
                <div className="option-item" key={block.id}>
                  <input
                    type="radio"
                    id={`protein-${block.id}`}
                    name="protein"
                    value={block.id}
                    checked={selectedProtein === block.id}
                    onChange={() => setSelectedProtein(block.id)}
                  />
                  <label htmlFor={`protein-${block.id}`}>
                    {block.block_name} (+{block.difference}원)
                  </label>
                </div>
              ))}
          </div>

          <div className="option-section">
            <h2 className="option-title">
              채소 <span className="required">필수</span>
            </h2>
            {Array.isArray(vegOptions) &&
              vegOptions.map((block) => (
                <div className="option-item" key={block.id}>
                  <input
                    type="radio"
                    id={`veg-${block.id}`}
                    name="veg"
                    value={block.id}
                    checked={selectedVeg === block.id}
                    onChange={() => setSelectedVeg(block.id)}
                  />
                  <label htmlFor={`veg-${block.id}`}>
                    {block.block_name} (+{block.difference}원)
                  </label>
                </div>
              ))}
          </div>

          <div className="option-section">
            <h2 className="option-title">
              소스 <span className="required">필수</span>
            </h2>
            {Array.isArray(flavorOptions) &&
              flavorOptions.map((block) => (
                <div className="option-item" key={block.id}>
                  <input
                    type="radio"
                    id={`flavor-${block.id}`}
                    name="flavor"
                    value={block.id}
                    checked={selectedFlavor === block.id}
                    onChange={() => setSelectedFlavor(block.id)}
                  />
                  <label htmlFor={`flavor-${block.id}`}>
                    {block.block_name} (+{block.difference}원)
                  </label>
                </div>
              ))}
          </div>
        </div>
        <div className="section-right">
          {/* 추가 옵션들 */}
          <div className="option-section">
            <h2 className="option-title">추가 단백질</h2>
            {Array.isArray(proteinOptions) &&
              proteinOptions.map((block) => (
                <div className="option-item" key={block.id}>
                  <input
                    type="checkbox"
                    id={`additionalProtein-${block.id}`}
                    value={block.id}
                    checked={additionalProtein.includes(block.id)}
                    onChange={() => handleAdditionalChange("protein", block.id)}
                  />
                  <label htmlFor={`additionalProtein-${block.id}`}>
                    {block.block_name} (+{Math.max((block.price ?? 0) - 300, 0)}
                    원)
                  </label>
                </div>
              ))}
          </div>
          <div className="option-section">
            <h2 className="option-title">추가 채소</h2>
            {Array.isArray(vegOptions) &&
              vegOptions.map((block) => (
                <div className="option-item" key={block.id}>
                  <input
                    type="checkbox"
                    id={`additionalVeg-${block.id}`}
                    value={block.id}
                    checked={additionalVeg.includes(block.id)}
                    onChange={() => handleAdditionalChange("veg", block.id)}
                  />
                  <label htmlFor={`additionalVeg-${block.id}`}>
                    {block.block_name} (+{Math.max((block.price ?? 0) - 300, 0)}
                    원)
                  </label>
                </div>
              ))}
          </div>
          <div className="option-section">
            <h2 className="option-title">추가 소스</h2>
            {Array.isArray(flavorOptions) &&
              flavorOptions.map((block) => (
                <div className="option-item" key={block.id}>
                  <input
                    type="checkbox"
                    id={`additionalFlavor-${block.id}`}
                    value={block.id}
                    checked={additionalFlavor.includes(block.id)}
                    onChange={() => handleAdditionalChange("flavor", block.id)}
                  />
                  <label htmlFor={`additionalFlavor-${block.id}`}>
                    {block.block_name} (+{Math.max((block.price ?? 0) - 100, 0)}
                    원)
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="button-wrapper">
        <div className="added-cost">
          <p>+{addedCost}원</p>
        </div>
        <Button text="메뉴 저장하기" onClick={handleSubmit} color="main" />
      </div>
    </Container>
  );
};

export default Option;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100dvh;
  padding: 50px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-button {
    font-size: 30px;
    color: ${main};
    cursor: pointer;
  }

  .title {
    font-size: 30px;
  }

  .content {
    display: flex;
    justify-content: space-between;
  }

  .section-left,
  .section-right {
    flex: 1;
    padding: 20px;
  }

  .option-section {
    .option-title {
      font-size: 20px;
      margin-bottom: 10px;
    }

    .required {
      font-size: 15px;
      color: ${main};
      margin-left: 8px;
      vertical-align: middle;
    }

    .option-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      input[type="radio"],
      input[type="checkbox"] {
        margin-right: 10px;
      }

      label {
        font-size: 18px;
        cursor: pointer;
      }
    }
  }

  .option-section + .option-section {
    margin-top: 50px;
  }

  .button-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px 20px;
    box-sizing: border-box;

    .added-cost {
      font-size: 18px;
      font-weight: bold;
      color: ${main};
      text-align: left;
      margin-bottom: 0;
    }

    button {
      margin-left: auto;
    }
  }
`;
