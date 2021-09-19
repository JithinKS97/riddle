import { HStack } from "@chakra-ui/react";
import OptionsMenu from "../common/OptionsMenu";
import StrokeSlider from "./StrokeSlider";
import ColorMenu from "./ColorMenu";
import { FillIcon, StrokeIcon } from "../custom icons";
import { GrPowerReset } from "react-icons/gr";
import { AppContext } from "../../../context/App";
import { useContext, useState } from "react";
import {
  drawOptions,
  resetOptions,
  cursorOptions,
  drawModes,
  cursorModes,
} from "../../../constant/menu";

const LeftSection = (props) => {
  const { resetPan, resetZoom, resetZoomAndPan } = props;
  const context = useContext(AppContext);
  const {
    selectedMode,
    setSelectedMode,
    selectedStroke,
    setSelectedStroke,
    setBrushSize,
    setSelectedFill,
    selectedFill,
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

  const onFillChange = (e) => {
    setSelectedFill(e.hex);
  };

  const handleSliderChange = (e) => {
    setBrushSize(e / 10);
  };

  const handleResetClick = (e) => {
    if (e.label === "Reset zoom") {
      resetZoomAndPan();
    } else if (e.label === "Reset pan") {
      resetPan();
    }
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
      <ColorMenu onChange={onFillChange}>
        <FillIcon color={selectedFill} />
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
      <OptionsMenu
        onClick={handleResetClick}
        defaultIcon={<GrPowerReset />}
        options={resetOptions}
      />
    </HStack>
  );
};

export default LeftSection;
