import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Input,
  InputRightElement,
  useClipboard,
  Button,
  InputGroup,
  Center,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

function IPFSSave(props) {
  const { show, cid, onClose } = props;
  const { hasCopied, onCopy } = useClipboard(cid);

  const handleCopyClick = () => {
    setTimeout(() => {
      onClose();
    }, 800);
    onCopy();
  };

  return (
    <>
      <Modal onClose={onClose} size="xl" isOpen={show} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Saving to IPFS</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody alignItems="center">
            {cid ? (
              <>
                <Text>Please note this id to get back the content</Text>
                <InputGroup marginTop="10px" size="md">
                  <Input value={cid}></Input>
                  <InputRightElement width="4.5rem">
                    <Button
                      onClick={handleCopyClick}
                      variant="primary"
                      h="1.75rem"
                      size="sm"
                    >
                      {hasCopied ? "Copied" : "Copy"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </>
            ) : (
              <Center>
                <Spinner />
              </Center>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default IPFSSave;
