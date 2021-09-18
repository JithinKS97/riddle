import { Flex, Menu } from "@chakra-ui/react";
import React from "react";
import LeftSection from "./left";

const TopMenu = () => {
  return (
    <>
      <style>{style}</style>
      <Menu>
        <Flex width="100vw" p="3" justifyContent="space-between" boxShadow="md">
          <Flex justifyContent="row">
            <LeftSection />
          </Flex>
        </Flex>
      </Menu>
    </>
  );
};

const style = ``;

export default TopMenu;
