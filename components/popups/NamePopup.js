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

  return (
    <>
      <Modal isCentered isOpen={show} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to Riddle!</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input onChange={handleNameChange} placeholder="Enter your name" />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!name}
              colorScheme="blue"
              mr={3}
              onClick={onNameSubmit}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BasicUsage;
