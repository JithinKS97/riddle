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
import { useState, useEffect } from "react";

function IPFSLoad(props) {
  const { show, onClose, onContentIdChange, loadContent } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleLoadClick = async () => {
    setIsLoading(true);
    await loadContent();
    setIsLoading(false);
  };

  const handleCloseClick = () => {
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    window.onkeydown = (e) => {
      if (e.key === "Enter") {
        handleLoadClick();
      }
    };
    return () => {
      window.onkeydown = null;
    };
  }, []);

  return (
    <>
      <Modal onClose={handleCloseClick} size="xl" isOpen={show} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Loading from IPFS</ModalHeader>
          <ModalCloseButton onClick={handleCloseClick} />
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
              <Button
                size="sm"
                onClick={handleLoadClick}
                variant="primary"
                float="right"
              >
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
