import { Container, Spinner, Center } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Container>
      <Center height="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#1A365D"
          size="xl"
        />
      </Center>
    </Container>
  );
};

export default Loading;
