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
import { env } from "../../../next.config";

function SharePopup(props) {
  const { shareLink, onClose, show } = props;
  const drawingboardLink = env.drawingboard;
  const link = `${drawingboardLink}?hostAddress=${shareLink}`;
  const { hasCopied, onCopy } = useClipboard(link);

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
          <ModalHeader>Anybody with below link can join the room</ModalHeader>
          <ModalBody>
            <InputGroup size="md">
              <Input isReadOnly value={link} pr="4.5rem" />
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
