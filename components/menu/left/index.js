import { HStack } from "@chakra-ui/react";
import OptionsMenu from "../common/OptionsMenu";
import StrokeSlider from "./StrokeSlider";
import ColorMenu from "./ColorMenu";
import { HiOutlineMinus } from "react-icons/hi";
import { BiRectangle } from "react-icons/bi";
import { BiCircle, BiHome } from "react-icons/bi";
import { FaPencilAlt } from "react-icons/fa";
import { FiMove } from "react-icons/fi";
import { ResetPan, ResetZoom, FillIcon, StrokeIcon } from "../custom icons";
import { AiOutlineSelect } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import { AppContext } from "../../../context/App";
import { useContext, useState } from "react";

const LeftSection = () => {
  const context = useContext(AppContext);
  const { selectedMode, setSelectedMode } = context;
  const [selectedDrawMode, setSelectedDrawMode] = useState("Pencil");
  const [selectedCursorMode, setSelectedCursorMode] = useState("Select");

  const handleClick = (e) => {
    const drawModes = drawOptions.map((drawOption) => drawOption.label);
    const cursorModes = cursorOptions.map((cursorOption) => cursorOption.label);
    if (drawModes.includes(e.label)) {
      setSelectedDrawMode(e.label);
    }
    if (cursorModes.includes(e.label)) {
      setSelectedCursorMode(e.label);
    }
    setSelectedMode(e.label);
  };

  return (
    <HStack p="3">
      <OptionsMenu
        onClick={handleClick}
        selectedOption={selectedDrawMode}
        options={drawOptions}
        highlighted={selectedMode === selectedDrawMode}
      />
      <StrokeSlider />
      <ColorMenu>
        <FillIcon />
      </ColorMenu>
      <ColorMenu>
        <StrokeIcon />
      </ColorMenu>
      <OptionsMenu
        onClick={handleClick}
        selectedOption={selectedCursorMode}
        options={cursorOptions}
        highlighted={selectedMode === selectedCursorMode}
      />
      <OptionsMenu defaultIcon={<GrPowerReset />} options={viewOptions} />
    </HStack>
  );
};

const drawOptions = [
  {
    label: "Pencil",
    icon: FaPencilAlt,
  },
  {
    label: "Line",
    icon: HiOutlineMinus,
  },
  {
    label: "Rectangle",
    icon: BiRectangle,
  },
  {
    label: "Ellipse",
    icon: BiCircle,
  },
];

const viewOptions = [
  {
    label: "Reset zoom",
    icon: ResetZoom,
  },
  {
    label: "Reset pan",
    icon: ResetPan,
  },
  {
    label: "Reset zoom & pan",
    icon: BiHome,
  },
];

const cursorOptions = [
  {
    label: "Select",
    icon: AiOutlineSelect,
  },
  {
    label: "Pan",
    icon: FiMove,
  },
];

export default LeftSection;
