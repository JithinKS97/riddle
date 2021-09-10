import { Flex, Button, HStack, Menu } from "@chakra-ui/react";
import { FaPencilAlt } from "react-icons/fa";
import { BiEraser, BiShareAlt } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";

const TopMenu = ({ onMembersIconClick, onShareIconClick }) => {
  return (
    <Menu>
      <Flex width="100vw" p="3" justifyContent="space-between" boxShadow="md">
        <HStack display="inline-block">
          <Button variant="menuButton">
            <FaPencilAlt size="20px" color="black" />
          </Button>
          <Button variant="menuButton">
            <BiEraser size="20px" color="black" />
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
  );
};

export default TopMenu;
