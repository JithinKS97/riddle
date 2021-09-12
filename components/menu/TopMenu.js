import {
  Flex,
  Button,
  HStack,
  Menu,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  MenuButton,
  MenuList,
  Box,
} from "@chakra-ui/react";
import { FaPencilAlt } from "react-icons/fa";
import { BiEraser, BiShareAlt } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { PENCIL, ERASER, SELECT } from "../../constant/mode";
import { AppContext } from ".././../context/App";
import { useContext } from "react";
import React from "react";
import { TwitterPicker } from "react-color";

const TopMenu = ({ onMembersIconClick, onShareIconClick }) => {
  const context = useContext(AppContext);

  const {
    selectedMode,
    setSelectedMode,
    setBrushSize,
    selectedColor,
    setSelectedColor,
  } = context;

  const handlePencilClick = () => {
    changeToPencilMode(PENCIL);
  };

  const handleEraserClick = () => {
    setSelectedMode(ERASER);
  };

  const handleSliderChange = (e) => {
    setSelectedMode(PENCIL);
    setBrushSize(e / 10);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.hex);
  };

  const chngeToSelectMode = () => {
    setSelectedMode(SELECT);
  };

  const changeToPencilMode = () => {
    setSelectedMode(PENCIL);
  };

  return (
    <>
      <style>{style}</style>
      <Menu>
        <Flex width="100vw" p="3" justifyContent="space-between" boxShadow="md">
          <Flex justifyContent="row">
            <Button
              onClick={handlePencilClick}
              className={selectedMode === PENCIL ? "selected" : "normal"}
            >
              <FaPencilAlt size="20px" />
            </Button>
            <Slider
              marginLeft="4"
              width="100px"
              aria-label="slider-ex-1"
              defaultValue={50}
              onChange={handleSliderChange}
              min={10}
              max={150}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb
                _hover={{ backgroundColor: "black" }}
                borderWidth="2px"
                borderColor="black"
                boxShadow="xs"
              />
            </Slider>
            <Menu
              onOpen={chngeToSelectMode}
              onClose={() => {
                setTimeout(() => {
                  changeToPencilMode();
                }, 10);
              }}
            >
              <MenuButton
                _active={{
                  bg: "white",
                }}
                className={"color-picker"}
                marginLeft="4"
                as={Button}
              >
                <Box
                  boxShadow="xs"
                  width="15px"
                  height="15px"
                  bg={selectedColor}
                />
              </MenuButton>
              <MenuList
                className="colorpicker"
                border="none"
                boxShadow="none"
                marginTop="3"
              >
                <TwitterPicker Button onChangeComplete={handleColorChange} />
              </MenuList>
            </Menu>
            <Button
              marginLeft="4"
              className={selectedMode === ERASER ? "selected" : "normal"}
              onClick={handleEraserClick}
            >
              <BiEraser size="20px" />
            </Button>
          </Flex>
          <HStack position="relative" right="0">
            <Button onClick={onMembersIconClick} variant="menuButton">
              <BsFillPeopleFill size="20px" color="black" />
            </Button>
            <Button onClick={onShareIconClick} variant="menuButton">
              <BiShareAlt size="20px" color="black" />
            </Button>
          </HStack>
        </Flex>
      </Menu>
    </>
  );
};

const style = `
  .normal {
    color:black;
    background-color:white;
    border:1px solid black;
    border-radius:20px;
  }
  *:focus {
    outline: 0 !important;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0) !important;
  }
  .normal:hover {
    color:black;
    background-color:white;
    border:1px solid black;
    border-radius:20px;
  }
  .selected {
    color:white;
    background-color:black;
    border-radius:20px;
  }
  .selected:hover {
    color:white;
    background-color:black;
    border-radius:20px;
  }
  .color-picker {
    color:black;
    background-color:white;
    border:1px solid black;
    border-radius:20px;
  }
  .color-picker:hover {
    color:black;
    background-color:white;
    border:1px solid black;
    border-radius:20px;
  }
`;

export default TopMenu;
