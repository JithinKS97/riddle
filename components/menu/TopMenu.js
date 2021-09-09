import { Flex, Button, HStack } from "@chakra-ui/react";
import { FaPencilAlt } from "react-icons/fa";
import { BiEraser } from "react-icons/bi";

const TopMenu = () => {
  return (
    <Flex p="3" justifyContent="center" boxShadow="md">
      <HStack display="inline-block">
        <Button variant="menuButton">
          <FaPencilAlt size="20px" color="black" />
        </Button>
        <Button variant="menuButton">
          <BiEraser size="20px" color="black" />
        </Button>
      </HStack>
    </Flex>
  );
};

export default TopMenu;
