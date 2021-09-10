import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Center,
  VStack,
} from "@chakra-ui/react";

function MembersPopup(props) {
  const { show, onClose, members } = props;

  return (
    <>
      <Modal size="sm" onClose={onClose} isCentered isOpen={show}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader alignSelf="center">
            Members present in the room
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody alignItems="center">
            <Center>
              <VStack>
                {members.map(({ name, identifier }) => {
                  return (
                    <Text key={identifier} fontWeight="bold">
                      {name}
                    </Text>
                  );
                })}
              </VStack>
            </Center>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MembersPopup;
