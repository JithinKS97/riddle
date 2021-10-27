import { HStack, Button } from "@chakra-ui/react";
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
import { Eraser, None } from "../../../constant/mode";
import { useEffect } from "react";
import { FaEraser } from "react-icons/fa";

const LeftSection = (props) => {
  const { resetPan, resetZoomAndPan } = props;
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
  const [previousMode, setPreviousMode] = useState("");

  // On load, we have to set the local selected mode
  useEffect(() => {
    setLocalMode(selectedMode);
  }, []);

  const handleClick = (e) => {
    setLocalMode(e.label);
    setSelectedMode(e.label);
  };

  const setLocalMode = (mode) => {
    if (drawModes.includes(mode)) {
      setSelectedDrawMode(mode);
    }
    if (cursorModes.includes(mode)) {
      setSelectedCursorMode(mode);
    }
  };

  const onStrokeChange = (e) => {
    setSelectedStroke(e.hex);
  };

  const onFillChange = (e) => {
    setSelectedFill(e.hex);
  };

  const restoreState = () => {
    // Restoring the state after the selection of color
    setSelectedMode(previousMode);
    setPreviousMode("");
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

  const onColorMenuClick = () => {
    // This is to prevent accidental drawing after the selection of color
    if (drawModes.includes(selectedMode)) {
      setSelectedMode(None);
      setPreviousMode(selectedMode);
    }
  };

  const onColorChangeComplete = () => {
    if (selectedMode === None) {
      restoreState();
    }
  };

  const setEraserMode = () => {
    setSelectedMode(Eraser);
  };

  return (
    <HStack p="3">
      <OptionsMenu
        onClick={handleClick}
        selectedOption={selectedDrawMode}
        options={drawOptions}
        highlighted={selectedMode === selectedDrawMode}
      />
      <Button
        variant={selectedMode === "Eraser" ? "primary" : undefined}
        onClick={setEraserMode}
      >
        <FaEraser />
      </Button>
      <StrokeSlider onChange={handleSliderChange} />
      <ColorMenu
        onClose={onColorChangeComplete}
        onMenuClick={onColorMenuClick}
        onChange={onFillChange}
      >
        <FillIcon color={selectedFill} />
      </ColorMenu>
      <ColorMenu
        onClose={onColorChangeComplete}
        onMenuClick={onColorMenuClick}
        onChange={onStrokeChange}
      >
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
