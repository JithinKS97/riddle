import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useClipboard,
} from "@chakra-ui/react";

function BasicUsage(props) {
  const { shareLink, onClose, show } = props;
  const { hasCopied, onCopy } = useClipboard(shareLink);

  return (
    <>
      <Modal width="50vw" isCentered onClose={onClose} isOpen={show}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text>Copy and share the link with others for them to join</Text>
            <InputGroup marginTop="20px" size="md">
              <Input isReadOnly value={shareLink} pr="4.5rem" />
              <InputRightElement width="4.5rem">
                <Button onClick={onCopy} h="1.75rem" size="sm">
                  {hasCopied ? "Copied" : "Copy"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BasicUsage;
