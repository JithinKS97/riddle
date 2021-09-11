import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";

const RoomJoinPopup = (props) => {
  const { show } = props;

  const router = useRouter();

  const [roomId, setRoomId] = useState("");

  const handleRoomIdEnter = (e) => {
    setRoomId(e.target.value);
  };

  const handleGoToRoom = () => {
    router.push(`/drawingboard/${roomId}`);
  };

  return (
    <>
      <Modal closeOnOverlayClick={false} isCentered isOpen={show}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter the room id</ModalHeader>

          <ModalBody>
            <Input onChange={handleRoomIdEnter} placeholder="Enter here" />
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleGoToRoom}
              disabled={!roomId}
              variant="primary"
              mr={3}
              size={"sm"}
            >
              Go to room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RoomJoinPopup;
