import { Flex, Button, HStack } from "@chakra-ui/react";

const TopMenu = () => {
  return (
    <Flex p="3" justifyContent="center" boxShadow="md">
      <HStack display="inline-block">
        <Button size="sm" variant="primary">
          Brush
        </Button>
        <Button size="sm" variant="primary">
          Brush size
        </Button>
        <Button size="sm" variant="primary">
          Color
        </Button>
        <Button size="sm" variant="primary">
          Select
        </Button>
      </HStack>
    </Flex>
  );
};

export default TopMenu;
