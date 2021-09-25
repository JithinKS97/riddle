import { Center, Button, Text, VStack, HStack, Box } from "@chakra-ui/react";
import nknApi from "../service/nkn";
import { AppContext } from "../context/App";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ScaleFade } from "@chakra-ui/react";
import RoomJoinPopup from "./popups/RoomJoinPopup";
import { AiFillGithub } from "react-icons/ai";

function LandingPage() {
  const context = useContext(AppContext);
  const { setClient, setIsHost } = context;
  const router = useRouter();
  const [showRoomJoinPopup, setShowRoomJoinPopup] = useState(false);

  const handleCollaborationClick = () => {
    setIsHost(true);
    const client = nknApi.createClient();
    const hostAddress = client.getPublicKey();
    setClient(client);
    goToCollabPage(hostAddress);
  };

  const goToCollabPage = (hostAddress) => {
    router.push(`drawingboard/${hostAddress}`);
  };

  const [show, setShow] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(function () {
      setShow(true);
    });
  }, []);

  const handleJoinRoomClick = () => {
    setShowRoomJoinPopup(true);
  };

  const closeRoomJoinPopup = () => {
    setShowRoomJoinPopup(false);
  };

  return (
    <>
      <style>{style({ show })}</style>
      <RoomJoinPopup onClose={closeRoomJoinPopup} show={showRoomJoinPopup} />
      <Center h="100vh">
        <ScaleFade initialScale={0.9} in={show}>
          <HStack position="relative" left="120px">
            <VStack>
              <Text color="#2C5282" className="title" fontSize="9xl">
                Riddle
              </Text>

              <Box suppressHydrationWarning position="relative" left="10px">
                Real time collaborative whiteboard
              </Box>
              <Button
                position="relative"
                top="20px"
                variant="primary"
                onClick={handleCollaborationClick}
              >
                Create a room
              </Button>
              <Button
                onClick={handleJoinRoomClick}
                position="relative"
                top="30px"
                variant="primary"
              >
                Join a room
              </Button>
            </VStack>
            <Box position="relative" left="20px">
              <img width="300px" height="300px" src={"pencil.gif"}></img>
            </Box>
          </HStack>
        </ScaleFade>
      </Center>
      <Box cursor="pointer" className="github">
        <a
          rel="noreferrer"
          href="https://github.com/JithinKS97/riddle"
          target="_blank"
        >
          <HStack>
            <span>Github repo</span>
            <AiFillGithub color="#2C5282" size="30px" />
          </HStack>
        </a>
      </Box>
    </>
  );
}

const style = ({ show }) => `
@font-face {
  font-family: "Caveat";
  src: url("/fonts/caveat.ttf");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
.title {
  font-family: 'Caveat', cursive;
}
.github {
  position:absolute;
  left:50vw;
  bottom:4%;
  transform:translate(-70%,0);
  opacity:${show ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
}
`;

export default LandingPage;
