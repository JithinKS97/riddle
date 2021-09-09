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

function NamePopup(props) {
  const { show, setName, name, onClose, onNameSubmit } = props;

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter" && name) {
      onNameSubmit();
    }
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isCentered
        isOpen={show}
        onClose={onClose}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to Riddle whiteboard</ModalHeader>

          <ModalBody>
            <Input
              onKeyDown={handleKeydown}
              onChange={handleNameChange}
              placeholder="Enter your name"
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!name}
              variant="primary"
              mr={3}
              size={"sm"}
              onClick={onNameSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NamePopup;
