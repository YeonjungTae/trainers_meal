import { MenuItem } from "../../types";

interface AddBlockProps {
  addBlock?: MenuItem["add_block"];
}

const AddBlockInfo: React.FC<AddBlockProps> = ({ addBlock }) => (
  <div className="add-info">
    {addBlock?.protein1 && <p>✚ {addBlock.protein1.name}</p>}
    {addBlock?.protein2 && <p>✚ {addBlock.protein2.name}</p>}
    {addBlock?.veg1 && <p>✚ {addBlock.veg1.name}</p>}
    {addBlock?.veg2 && <p>✚ {addBlock.veg2.name}</p>}
    {addBlock?.flavor && <p>✚ {addBlock.flavor.name}</p>}
  </div>
);

export default AddBlockInfo;
