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
import { Pencil } from "../../../constant/mode";

const LeftSection = () => {
  const context = useContext(AppContext);
  const {
    selectedMode,
    setSelectedMode,
    selectedStroke,
    setSelectedStroke,
    setBrushSize,
  } = context;
  const [selectedDrawMode, setSelectedDrawMode] = useState("Pencil");
  const [selectedCursorMode, setSelectedCursorMode] = useState("Select");

  const handleClick = (e) => {
    if (drawModes.includes(e.label)) {
      setSelectedDrawMode(e.label);
    }
    if (cursorModes.includes(e.label)) {
      setSelectedCursorMode(e.label);
    }
    setSelectedMode(e.label);
  };

  const onStrokeChange = (e) => {
    setSelectedStroke(e.hex);
  };

  const handleSliderChange = (e) => {
    setSelectedMode(Pencil);
    setBrushSize(e / 10);
  };

  return (
    <HStack p="3">
      <OptionsMenu
        onClick={handleClick}
        selectedOption={selectedDrawMode}
        options={drawOptions}
        highlighted={selectedMode === selectedDrawMode}
      />
      <StrokeSlider onChange={handleSliderChange} />
      <ColorMenu>
        <FillIcon />
      </ColorMenu>
      <ColorMenu onChange={onStrokeChange}>
        <StrokeIcon color={selectedStroke} />
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

const drawModes = drawOptions.map((drawOption) => drawOption.label);
const cursorModes = cursorOptions.map((cursorOption) => cursorOption.label);

export default LeftSection;
