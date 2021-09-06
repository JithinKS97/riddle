import { Center, Button, Container } from "@chakra-ui/react";
import { createClient } from "../services/nkn";
import { AppContext } from "../context/App";
import { useContext } from "react";
import { useRouter } from "next/router";

function LandingPage() {
  const context = useContext(AppContext);
  const { setClient } = context;
  const router = useRouter();

  const handleCollaborationClick = () => {
    const client = createClient();
    const publicKey = client.getPublicKey();
    setClient(client);
    goToCollabPage(publicKey);
  };

  const goToCollabPage = (publicKey) => {
    router.push(`drawingboard/${publicKey}`);
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
