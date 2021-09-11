import { Flex, Button, HStack, Menu } from "@chakra-ui/react";
import { FaPencilAlt } from "react-icons/fa";
import { BiEraser, BiShareAlt } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { PENCIL, ERASER } from "../../constant/mode";

const TopMenu = ({
  onMembersIconClick,
  onShareIconClick,
  setSelectedTool,
  selectedTool,
}) => {
  const handlePencilClick = () => {
    setSelectedTool(PENCIL);
  };

  const handleEraserClick = () => {
    setSelectedTool(ERASER);
  };

  return (
    <>
      <style>{style}</style>
      <Menu>
        <Flex width="100vw" p="3" justifyContent="space-between" boxShadow="md">
          <HStack display="inline-block">
            <Button
              onClick={handlePencilClick}
              className={selectedTool === PENCIL ? "selected" : "normal"}
            >
              <FaPencilAlt size="20px" />
            </Button>
            <Button
              className={selectedTool === ERASER ? "selected" : "normal"}
              onClick={handleEraserClick}
            >
              <BiEraser size="20px" />
            </Button>
          </HStack>
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
`;

export default TopMenu;
