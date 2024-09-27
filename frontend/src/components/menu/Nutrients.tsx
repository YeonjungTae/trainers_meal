import { MenuItem } from "../../types";

interface NutrientsProps {
  nutrients: MenuItem["nutrients"];
}

const nutrientLabels: { [key: string]: { label: string; unit: string } } = {
  calories: { label: "칼로리", unit: "kcal" },
  carbohydrate: { label: "탄수화물", unit: "g" },
  protein: { label: "단백질", unit: "g" },
  fat: { label: "지방", unit: "g" },
  sodium: { label: "나트륨", unit: "mg" },
  sugar: { label: "당", unit: "g" },
};

const Nutrients: React.FC<NutrientsProps> = ({ nutrients }) => (
  <div className="nutrients">
    {Object.entries(nutrients).map(([key, value]) => {
      const nutrient = nutrientLabels[key];
      return (
        <div key={key} className="nutrient-item">
          <span className="nutrient-name">{nutrient.label}</span>
          <span className="nutrient-value">
            {value} {nutrient.unit}
          </span>
        </div>
      );
    })}
  </div>
);

export default Nutrients;
