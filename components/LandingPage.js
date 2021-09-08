import { Center, Button, Container } from "@chakra-ui/react";
import nknApi from "../services/nkn";
import { AppContext } from "../context/App";
import { useContext } from "react";
import { useRouter } from "next/router";

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
    <Container>
      <Center h="100vh">
        <Button onClick={handleCollaborationClick}>Start collaboration</Button>
      </Center>
    </Container>
  );
}

export default LandingPage;
