import { Menu, Button, Box, HStack } from "@chakra-ui/react";

const TopMenu = () => {
  return (
    <Box height="60px" p="2" boxShadow="md">
      <Box>
        <HStack margin="auto">
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
      </Box>
    </Box>
  );
};

export default TopMenu;
