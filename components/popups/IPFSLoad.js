import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";

function IPFSLoad(props) {
  const { show, onClose, onContentIdChange, loadContent } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleLoadClick = async () => {
    setIsLoading(true);
    await loadContent();
    setIsLoading(false);
  };

  return (
    <>
      <Modal onClose={onClose} size="xl" isOpen={show} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Load from IPFS</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          {!isLoading ? (
            <>
              <ModalBody alignItems="center">
                <Input onChange={onContentIdChange}></Input>
              </ModalBody>
            </>
          ) : (
            <Center>
              <Spinner />
            </Center>
          )}
          <ModalFooter>
            {!isLoading ? (
              <Button onClick={handleLoadClick} variant="primary" float="right">
                Load
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default IPFSLoad;
