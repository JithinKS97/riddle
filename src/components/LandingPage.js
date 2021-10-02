import { Center, Button, Text, VStack, HStack, Box } from "@chakra-ui/react";
import nknApi from "../service/nkn";
import { AppContext } from "../context/App";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ScaleFade } from "@chakra-ui/react";
import RoomJoinPopup from "./popups/RoomJoinPopup";
import { AiFillGithub } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import Link from "next/link";

function LandingPage() {
  const context = useContext(AppContext);
  const { setClient, setIsHost, setLoading, setMembers } = context;
  const router = useRouter();
  const [showRoomJoinPopup, setShowRoomJoinPopup] = useState(false);
  const [hostAddress, setHostAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();
  const toastRef = useRef();

  const handleCollaborationClick = () => {
    setIsHost(true);
  };

  const [show, setShow] = useState(false);

  const showConnectingToast = () => {
    toastRef.current = toast({
      title: `Connecting...`,
      isClosable: false,
      duration: null,
      position: "top",
    });
  };

  const showConnectedStatus = () => {
    toast({
      title: `Connected`,
      status: "success",
      position: "top",
      duration: 1000,
    });
  };

  useEffect(() => {
    showConnectingToast();
    setMembers([]);
    const client = nknApi.createClient();
    console.log(client);
    console.log("Trying to connect...");
    client.onConnect(() => {
      console.log("Finished connecting...");
      showConnectedStatus();
      setIsConnected(true);
      setLoading(false);
      toast.close(toastRef.current);
    });
    const hostAddress = client.getPublicKey();
    setHostAddress(hostAddress);
    setClient(client);
    document.fonts.ready.then(function () {
      setShow(true);
    });
  }, []);

  const handleJoinRoomClick = () => {
    setShowRoomJoinPopup(true);
  };

  const closeRoomJoinPopup = () => {
    setIsHost(false);
    setShowRoomJoinPopup(false);
  };

  return (
    <>
      <style>{style({ show })}</style>
      <RoomJoinPopup onClose={closeRoomJoinPopup} show={showRoomJoinPopup} />
      <Center h="100vh">
        <ScaleFade initialScale={0.9} in={show}>
          <HStack position="relative" left="140px">
            <VStack>
              <Text color="#2C5282" className="title" fontSize="9xl">
                Riddle
              </Text>

              <Box suppressHydrationWarning position="relative" left="10px">
                Real time collaborative whiteboard
              </Box>
              <Link
                href={{
                  pathname: "/drawingboard",
                  query: { hostAddress },
                }}
              >
                <Button
                  position="relative"
                  top="20px"
                  variant="primary"
                  disabled={!isConnected}
                  onClick={handleCollaborationClick}
                >
                  Create a room
                </Button>
              </Link>
              <Button
                onClick={handleJoinRoomClick}
                position="relative"
                top="30px"
                variant="primary"
                disabled={!isConnected}
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
  transform:translate(-50%,0);
  opacity:${show ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
}
`;

export default LandingPage;
