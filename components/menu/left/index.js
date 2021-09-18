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

const LeftSection = () => {
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

  const modeOptions = [
    {
      label: "Select",
      icon: AiOutlineSelect,
    },
    {
      label: "Pan",
      icon: FiMove,
    },
  ];

  return (
    <HStack p="3">
      <OptionsMenu selectedOption="Pencil" options={drawOptions} />
      <StrokeSlider />
      <ColorMenu>
        <FillIcon />
      </ColorMenu>
      <ColorMenu>
        <StrokeIcon />
      </ColorMenu>
      <OptionsMenu selectedOption="Select" options={modeOptions} />
      <OptionsMenu defaultIcon={<GrPowerReset />} options={viewOptions} />
    </HStack>
  );
};

export default LeftSection;
