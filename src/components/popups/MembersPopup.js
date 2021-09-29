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
  HStack,
  Box,
} from "@chakra-ui/react";

function MembersPopup(props) {
  const { show, onClose, members, hostAddress } = props;

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
                {members.map(({ name, identifier, color }) => {
                  return (
                    <HStack key={identifier}>
                      <Text fontWeight="bold">{name}</Text>
                      <Box bg={color} width="10px" height="10px"></Box>
                      {hostAddress === identifier ? <Box>(host)</Box> : null}
                    </HStack>
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
