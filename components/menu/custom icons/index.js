import { FiSquare, FiMove } from "react-icons/fi";
import { Box, HStack } from "@chakra-ui/react";
import { GrPowerReset } from "react-icons/gr";
import { TiZoomOutline } from "react-icons/ti";

export const ResetZoom = () => {
  return (
    <Box>
      <HStack>
        <GrPowerReset size="15px" />
        <TiZoomOutline size="15px" />
      </HStack>
    </Box>
  );
};

export const ResetPan = () => {
  return (
    <Box>
      <HStack>
        <GrPowerReset size="15px" />
        <FiMove />
      </HStack>
    </Box>
  );
};

export const FillIcon = ({ color }) => <div style={fillStyle(color)}></div>;

export const StrokeIcon = ({ color }) => (
  <FiSquare fontWeight="bold" width="15px" height="15px" color={color} />
);

const fillStyle = (color) => ({
  width: "15px",
  height: "15px",
  backgroundColor: color,
  border: "2px solid black",
  borderRadius: "20%",
});
