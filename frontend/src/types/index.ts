export interface MenuItem {
  id: string;
  day: string;
  menu_name: string;
  totalPrice: number;
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
