import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { isValidId } from "../../services/nkn";

const RoomJoinPopup = (props) => {
  const { show, onClose } = props;

  const router = useRouter();

  const [roomId, setRoomId] = useState("");

  const handleRoomIdEnter = (e) => {
    setRoomId(e.target.value);
  };

  const handleGoToRoom = () => {
    if (!isValidId(roomId)) {
      alert("Invalid room id");
      return;
    }
    router.push(`/drawingboard/${roomId}`);
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter" && roomId) {
      handleGoToRoom();
    }
  };

  return (
    <>
      <Modal onClose={onClose} isCentered isOpen={show}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter the room id</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              onKeyDown={handleKeydown}
              onChange={handleRoomIdEnter}
              placeholder="Enter here"
            />
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
