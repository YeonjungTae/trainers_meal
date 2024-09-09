import { MenuItem } from "../../types";

interface BlockProps {
  block: MenuItem["block"];
}

const BlockInfo: React.FC<BlockProps> = ({ block }) => (
  <div className="block-info">
    <p>{block.base.name}</p>
    <p>{block.protein.name}</p>
    <p>{block.veg.name}</p>
    <p>{block.flavor.name}</p>
  </div>
);

export default BlockInfo;
