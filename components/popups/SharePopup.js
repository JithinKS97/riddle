import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useClipboard,
} from "@chakra-ui/react";

function SharePopup(props) {
  const { shareLink, onClose, show } = props;
  const { hasCopied, onCopy } = useClipboard(shareLink);

  const handleCopyClick = () => {
    setTimeout(() => {
      onClose();
    }, 800);
    onCopy();
  };

  return (
    <>
      <Modal size="xl" isCentered onClose={onClose} isOpen={show}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Copy the link and share with others for them to join
          </ModalHeader>
          <ModalBody>
            <InputGroup size="md">
              <Input isReadOnly value={shareLink} pr="4.5rem" />
              <InputRightElement width="4.5rem">
                <Button
                  variant="primary"
                  onClick={handleCopyClick}
                  h="1.75rem"
                  size="sm"
                >
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

export default SharePopup;
