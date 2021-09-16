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
import { BiShareAlt } from "react-icons/bi";
import { FiMove } from "react-icons/fi";
import { BsFillPeopleFill } from "react-icons/bs";
import { PENCIL, ERASER, SELECT, PAN, NONE } from "../../constant/mode";
import { AppContext } from ".././../context/App";
import { useContext, useState } from "react";
import React from "react";
import { TwitterPicker } from "react-color";
import { AiOutlineSelect } from "react-icons/ai";

const colors = [
  "#000000",
  "#FF6900",
  "#FCB900",
  "#7BDCB5",
  "#00D084",
  "#8ED1FC",
  "#0693E3",
  "#EB144C",
  "#F78DA7",
  "#9900EF",
];

const TopMenu = ({ onMembersIconClick, onShareIconClick }) => {
  const context = useContext(AppContext);

  const {
    selectedMode,
    setSelectedMode,
    setBrushSize,
    selectedColor,
    setSelectedColor,
  } = context;

  const [currentMode, setCurrentMode] = useState();

  const handlePencilClick = () => {
    changeToPencilMode(PENCIL);
  };

  const handleSliderChange = (e) => {
    setSelectedMode(PENCIL);
    setBrushSize(e / 10);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.hex);
  };

  const changeToSelectMode = () => {
    setSelectedMode(SELECT);
  };

  const changeToPencilMode = () => {
    setSelectedMode(PENCIL);
  };

  const changeToPanMode = () => {
    setSelectedMode(PAN);
  };

  const changeToNoneMode = () => {
    setCurrentMode(selectedMode);
    setSelectedMode(NONE);
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
              onChangeEnd={handleSliderChange}
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
              onOpen={changeToNoneMode}
              onClose={() => {
                setTimeout(() => {
                  setSelectedMode(currentMode);
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
                <TwitterPicker colors={colors} onChange={handleColorChange} />
              </MenuList>
            </Menu>
            <Button
              marginLeft="4"
              onClick={changeToSelectMode}
              className={selectedMode === SELECT ? "selected" : "normal"}
            >
              <AiOutlineSelect size="20px" />
            </Button>
            <Button
              className={selectedMode === PAN ? "selected" : "normal"}
              marginLeft="4"
              onClick={changeToPanMode}
            >
              <FiMove size="20px" />
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
    border:1px solid black;
    border-radius:20px;
  }
  .selected:hover {
    color:white;
    background-color:black;
    border:1px solid black;
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
