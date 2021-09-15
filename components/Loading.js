import { Container, Spinner, Center, Box, VStack } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Container>
      <Center height="100vh">
        <VStack>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#1A365D"
            size="xl"
          />
          <Box position="relative" left="5px">
            Loading...
          </Box>
        </VStack>
      </Center>
    </Container>
  );
};

export default Loading;
