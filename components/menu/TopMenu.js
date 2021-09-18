import { Flex, Menu } from "@chakra-ui/react";
import React from "react";
import LeftSection from "./left";
import RightSection from "./right";

const TopMenu = (props) => {
  return (
    <>
      <style>{style}</style>
      <Menu>
        <Flex width="100vw" justifyContent="space-between" boxShadow="md">
          <LeftSection {...props} />
          <RightSection {...props} />
        </Flex>
      </Menu>
    </>
  );
};

const style = ``;

export default TopMenu;
