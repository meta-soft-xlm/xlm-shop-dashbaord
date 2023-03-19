import { useCallback, useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Button,
  Center,
  useColorModeValue,
  Text,
  Image,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import useFilesStore from "../../store/files";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

function Upload(props = {}) {
  const { isOpen = false, onClose, on } = props;
  const files = useFilesStore((state) => state.files);
  const postFiles = useFilesStore((state) => state.postFiles);
  const toast = useToast();
  const [uploads, setUploads] = useState([]);

  const onDrop = useCallback(async (acceptedUploads) => {
    setUploads(
      acceptedUploads.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 3,
    multiple: true,
  });
  useEffect(() => {
    setUploads([]);
  }, []);
  useEffect(
    () => () => {
      uploads.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [uploads]
  );

  const saveUploads = async () => {
    try {
      const data = await postFiles(uploads);
      setUploads([]);
      onClose(data || []);
    } catch (e) {
      toast({
        title:
          "Incognito mode is not allowed. " +
          (e.message || INTERNAL_SERVER_ERROR),
        status: "error",
      });
    }
  };

  const dropText = isDragActive
    ? "Drop upto 3 png, jpeg or gifs here ..."
    : "Drag 'n' drop upto 3 png, jpeg or gifs files here, or click to select uploads";
  const activeBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue(
    isDragActive ? "teal.300" : "gray.300",
    isDragActive ? "teal.500" : "gray.500"
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      onEsc={() => setUploads([])}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add images for this look.</ModalHeader>
        <ModalBody>
          <Center
            p={10}
            cursor="pointer"
            bg={isDragActive ? activeBg : "transparent"}
            _hover={{ bg: activeBg }}
            transition="background-color 0.2s ease"
            borderRadius={4}
            border="3px dashed"
            borderColor={borderColor}
            {...getRootProps()}
          >
            <VStack>
              <div>
                <input {...getInputProps()} />
                <Text textAlign="center">{dropText}</Text>
              </div>
            </VStack>
          </Center>
          <Center>
            <SimpleGrid spacing={5} columns={3} marginTop="5">
              {uploads.map((file) => (
                <Image
                  key={file.name}
                  src={file.preview}
                  width={100}
                  height={100}
                  objectFit="cover"
                  borderRadius="5"
                  borderColor="gray"
                  borderWidth="2"
                />
              ))}
            </SimpleGrid>
          </Center>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setUploads([]);
              onClose([]);
            }}
            colorScheme="red"
          >
            Close
          </Button>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={saveUploads}
            loadingText="Uploading..."
            isLoading={files.post.loading}
          >
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Upload;
