import { Center, Button, Text, VStack, HStack, Box } from "@chakra-ui/react";
import nknApi from "../services/nkn";
import { AppContext } from "../context/App";
import { useContext } from "react";
import { useRouter } from "next/router";
import Cover from "../public/pencil.gif";
import Image from "next/image";

function LandingPage() {
  const context = useContext(AppContext);
  const { setClient, setIsMainClient } = context;
  const router = useRouter();

  const handleCollaborationClick = () => {
    setIsMainClient(true);
    const client = nknApi.createClient({ isMainClient: true });
    const seed = client.getSeed();
    setClient(client);
    goToCollabPage(seed);
  };

  const goToCollabPage = (id) => {
    router.push(`drawingboard/${id}`);
  };

  return (
    <>
      <style>{style}</style>
      <Center h="100vh">
        <HStack position="relative" left="110px">
          <VStack>
            <Text color="#2C5282" className="title" fontSize="9xl">
              Riddle
            </Text>
            <Box position="relative" left="10px">
              Real time collaborative whiteboard
            </Box>
            <Button
              position="relative"
              top="20px"
              _hover={{
                backgroundColor: "#4299E1",
              }}
              background="#1A365D"
              color="white"
              fontSize="20px"
              onClick={handleCollaborationClick}
            >
              Start collaboration
            </Button>
          </VStack>
          <Box position="relative" left="20px">
            <Image width="300px" height="300px" src={Cover}></Image>
          </Box>
        </HStack>
      </Center>
    </>
  );
}

const style = `
@import url('https://fonts.googleapis.com/css2?family=Allison&family=Caveat&family=Dancing+Script&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;1,400&display=swap');

.title {
  font-family: 'Caveat', cursive;
}
.label {
  font-family: 'Roboto', sans-serif;
  font-size:20px;
  font-weight:bold;
}
`;

export default LandingPage;
