import { Center, Button, Container } from "@chakra-ui/react";
import nknApi from "../services/nkn";
import { AppContext } from "../context/App";
import { useContext } from "react";
import { useRouter } from "next/router";

function LandingPage() {
  const context = useContext(AppContext);
  const { setClient } = context;
  const router = useRouter();

  const handleCollaborationClick = () => {
    const client = nknApi.createClient({ isMainClient: true });

    console.log("Client created...");
    console.log(client);

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
