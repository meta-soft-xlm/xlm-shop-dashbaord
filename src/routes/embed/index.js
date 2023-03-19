import { useEffect, useState, useContext } from "react";
import {
  Container,
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Link,
  Button,
  Flex,
  SimpleGrid,
  VStack,
  Divider,
  Skeleton,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
  useBreakpointValue,
} from "@chakra-ui/react";
import Carousel from "../../components/carousel";
import useLooksStore from "../../store/looks";
import useProductsStore from "../../store/products";
import useViewsStore from "../../store/views";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ShopContext } from "../../context";
import "../../embed.css";

const ProductsModal = (props) => {
  const { isOpen, onClose, productIds = [], lookId } = props;
  const products = useProductsStore((state) => state.products);
  const getProducts = useProductsStore((state) => state.getProducts);
  const shop = useContext(ShopContext);

  useEffect(() => {
    getProducts({ products: productIds, shop });
  }, []);

  const renderProducts = () => {
    if (products.get.loading) {
      return (
        <SimpleGrid minChildWidth="330px" spacing="10px">
          {[1, 2, 3].map((e, i) => (
            <Center p={4} key={i}>
              <Skeleton width="330px" height="330px" />
            </Center>
          ))}
        </SimpleGrid>
      );
    } else if (products.get.failure.error) {
      return (
        <Box>
          <Flex direction="column" align="center">
            <VStack spacing="3">
              <Heading as="h1" size="md">
                {products.get.failure.message}
              </Heading>
            </VStack>
            <br />
            <Divider />
            <br />
            <VStack spacing="3">
              <Button
                onClick={() => getProducts({ products: productIds, shop })}
              >
                Try Again
              </Button>
            </VStack>
          </Flex>
        </Box>
      );
    } else if (products.get.success.data.length) {
      return (
        <SimpleGrid minChildWidth="330px" spacing="10px">
          {products.get.success.data.map((product) => (
            <Center py={8} key={product.admin_graphql_api_id || product.id}>
              <Box
                role={"group"}
                p={4}
                maxW={"330px"}
                w={"full"}
                boxShadow={"2xl"}
                rounded={"lg"}
                pos={"relative"}
                zIndex={1}
              >
                <Box
                  rounded={"lg"}
                  mt={-12}
                  pos={"relative"}
                  height={"260px"}
                  _groupHover={{
                    _after: {
                      filter: "blur(20px)",
                    },
                  }}
                >
                  <Carousel medias={product.images} height={260} width={282} />
                </Box>
                <Stack pt={3} align={"center"}>
                  <Text
                    color={"gray.500"}
                    fontSize={"sm"}
                    textTransform={"uppercase"}
                  >
                    {product.variants && product.variants.length
                      ? `${product.variants.length} variants available`
                      : null}
                  </Text>
                  <Heading
                    textAlign="center"
                    fontSize={"2xl"}
                    fontFamily={"body"}
                    fontWeight={500}
                  >
                    {product.title}
                  </Heading>
                  <Link
                    marginTop={"10px"}
                    href={`http://${shop}/products/${product.handle}?app=shoplook&lookid=${lookId}`}
                    target="_blank"
                    width="full"
                  >
                    <Button isFullWidth rightIcon={<ExternalLinkIcon />}>
                      View Product
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Center>
          ))}
        </SimpleGrid>
      );
    } else {
      return null;
    }
  };
  return (
    <>
      <Modal
        isCentered
        scrollBehavior={"inside"}
        closeOnOverlayClick
        blockScrollOnMount={false}
        preserveScrollBarGap
        lockFocusAcrossFrames={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Shop the products in this look</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{renderProducts()}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const EmbedRoute = (props) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const looks = useLooksStore((state) => state.looks);
  const getLooks = useLooksStore((state) => state.getLooks);
  const shop = useContext(ShopContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productIds, setProductIds] = useState([]);
  const [isModalvis, setIsModalvis] = useState(false);
  const [currentLookId, setCurrentLookId] = useState("");
  const getViews = useViewsStore((state) => state.getViews);
  const viewsState = useViewsStore((state) => state.viewsState);

  useEffect(() => {
    getViews({ shop });
    getLooks({ shop });
  }, []);

  const onLooksClick = ({ lookId, products }) => {
    setProductIds(products);
    setCurrentLookId(lookId);
    setIsModalvis(true);
    onOpen();
  };

  const onModalClose = () => {
    setCurrentLookId("");
    setProductIds([]);
    setIsModalvis(false);
    onClose();
  };

  const renderList = () => {
    if (looks.get.loading) {
      return [1, 2, 3].map((e, i) => (
        <Center key={i}>
          <Skeleton width="330px" height="330px" />
        </Center>
      ));
    } else if (looks.get.failure.error) {
      return (
        <Box>
          <Flex direction="column" align="center">
            <VStack spacing="3">
              <Heading as="h1" size="md">
                {looks.get.failure.message}
              </Heading>
            </VStack>
            <br />
            <Divider />
            <br />
            <VStack spacing="3">
              <Button onClick={() => getLooks({ shop })}>Try Again</Button>
            </VStack>
          </Flex>
        </Box>
      );
    } else if (looks.get.success.data.length) {
      return (
        <>
          {isModalvis ? (
            <ProductsModal
              isOpen={isOpen}
              onClose={onModalClose}
              lookId={currentLookId}
              productIds={productIds}
            />
          ) : null}
          {looks.get.success.data.map((look) => (
            <Center py={8} key={look.id || look.objectId}>
              <Box
                role={"group"}
                p={4}
                maxW={"330px"}
                w={"full"}
                bg={bgColor}
                boxShadow={"2xl"}
                rounded={"lg"}
                pos={"relative"}
                zIndex={1}
              >
                <Box
                  rounded={"lg"}
                  mt={-12}
                  pos={"relative"}
                  height={"260px"}
                  // _after={{
                  // 	transition: 'all .3s ease',
                  // 	content: '""',
                  // 	w: 'full',
                  // 	h: 'full',
                  // 	pos: 'absolute',
                  // 	top: 5,
                  // 	left: 0,
                  // 	backgroundImage: `url(${look.get('medias')[0].url()})`,
                  // 	filter: 'blur(15px)',
                  // 	zIndex: -1,
                  // }}
                  _groupHover={{
                    _after: {
                      filter: "blur(20px)",
                    },
                  }}
                >
                  {/* <Image
											rounded={'lg'}
											height={230} 
											width={282}
											objectFit={'cover'}
											src={'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80'}
										/> */}
                  <Carousel medias={look.medias} height={260} width={282} />
                </Box>
                <Stack pt={3} align={"center"}>
                  <Text
                    color={"gray.500"}
                    fontSize={"sm"}
                    textTransform={"uppercase"}
                  >
                    {look.products.length} products in this look
                  </Text>
                  <Heading
                    fontSize={"2xl"}
                    fontFamily={"body"}
                    fontWeight={500}
                  >
                    {look.name}
                  </Heading>
                  <Button
                    marginTop={"10px"}
                    onClick={() =>
                      onLooksClick({
                        lookId: look.id || look.objectId,
                        products: look.products,
                      })
                    }
                    isFullWidth
                  >
                    XLM Shop
                  </Button>
                </Stack>
              </Box>
            </Center>
          ))}
        </>
      );
    }
  };

  return (
    <Container maxW={"7xl"} p="12">
      <Center>
        <Heading>XLM Shop</Heading>
      </Center>
      <br />
      <SimpleGrid minChildWidth="330px" spacing="10px">
        {renderList()}
      </SimpleGrid>
    </Container>
  );
};

export default EmbedRoute;
