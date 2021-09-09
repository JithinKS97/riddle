import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Text,
  Box,
} from "@chakra-ui/react";

function BasicUsage(props) {
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
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to Riddle!</ModalHeader>
          <ModalCloseButton isDisabled={!name} />

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

export default BasicUsage;
