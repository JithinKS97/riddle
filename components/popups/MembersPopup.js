import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";

function MembersPopup(props) {
  const { show, onClose, members } = props;

  return (
    <>
      <Modal onClose={onClose} isCentered isOpen={show}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Members present in the room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnorderedList>
              {members.map(({ name }) => {
                return <ListItem>{name}</ListItem>;
              })}
            </UnorderedList>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MembersPopup;
