import { useEffect, useContext } from "react";
import {
  Box,
  Heading,
  Icon,
  Text,
  Divider,
  HStack,
  Flex,
  SimpleGrid,
  Stack,
  Button,
  useColorModeValue,
  Container,
  VStack,
  useToast,
  Skeleton,
  Alert,
  Code,
  ButtonGroup,
  useDisclosure,
  Link as ChakraLink,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import Carousel from "../../components/carousel";
import {
  IoCaretForwardOutline,
  IoHandLeftSharp,
  IoEye,
  IoCartSharp,
  IoLogoUsd,
  IoWallet,
} from "react-icons/io5";

import { Link } from "react-router-dom";
import useLooksStore from "../../store/looks";
import useScriptsStore from "../../store/scripts";
import useViewsStore from "../../store/views";
import useChargesStore from "../../store/charges";
import { ShopContext } from "../../context";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import { LinkIcon } from "@chakra-ui/icons";

const renderSkeleton = (looks) => {
  return (
    <Flex alignItems="flex-start" flexDirection="row">
      <Skeleton>
        <Carousel medias={[]} />
      </Skeleton>
      <Flex direction="column" width="90%" marginLeft="5">
        <Skeleton width="100%" height="40px"></Skeleton>
        <br />
        <Skeleton width="100%" height="20px"></Skeleton>
        <br />
        <Skeleton width="100%" height="20px"></Skeleton>
        <br />
        <Skeleton width="100%" height="20px"></Skeleton>
      </Flex>
    </Flex>
  );
};

const renderLookPoints = ({ look }) => {
  return (
    <SimpleGrid columns={2} spacing={5} marginTop="5">
      <HStack align={"top"}>
        <Box color={"green.400"} px={2}>
          <Icon as={IoEye} />
        </Box>
        <VStack align={"start"}>
          <Text fontWeight={600}>Views</Text>
          <Text color={"gray.600"} marginTop="0" style={{ marginTop: 0 }}>
            Total views
          </Text>
        </VStack>
      </HStack>
      <HStack align={"top"}>
        <Box color={"green.400"} px={2}>
          <Icon as={IoHandLeftSharp} />
        </Box>
        <VStack align={"start"}>
          <Text fontWeight={600}>Clicks</Text>
          <Text color={"gray.600"} marginTop="0" style={{ marginTop: 0 }}>
            Total clicks
          </Text>
        </VStack>
      </HStack>
      <HStack align={"top"}>
        <Box color={"green.400"} px={2}>
          <Icon as={IoCartSharp} />
        </Box>
        <VStack align={"start"}>
          <Text fontWeight={600}>Add to Cart</Text>
          <Text color={"gray.600"} marginTop="0" style={{ marginTop: 0 }}>
            Cart revenue
          </Text>
        </VStack>
      </HStack>
      <HStack align={"top"}>
        <Box color={"green.400"} px={2}>
          <Icon as={IoWallet} />
        </Box>
        <VStack align={"start"}>
          <Text fontWeight={600}>Conversion</Text>
          <Text color={"gray.600"} marginTop="0" style={{ marginTop: 0 }}>
            Total revenue
          </Text>
        </VStack>
      </HStack>
    </SimpleGrid>
  );
};

const renderCarousel = ({ orangeColorMode, look }) => {
  return (
    <Box
      display="flex"
      flex="1"
      marginRight="3"
      position="relative"
      alignItems="center"
    >
      <Box zIndex="1" width="100%" position="absolute" height="100%">
        <Box
          bgGradient={orangeColorMode}
          backgroundSize="20px 20px"
          opacity="0.4"
          height="100%"
        />
      </Box>
      <Box width={{ base: "100%" }} zIndex="2">
        <Carousel medias={look.medias} />
      </Box>
    </Box>
  );
};

export const LooksCreatedDate = (props) => {
  return (
    <HStack display="flex" alignItems="center">
      <Text fontWeight="light" fontSize="sm">
        Created at:
      </Text>
      <Text fontSize="sm">
        {props.date.toLocaleString(DateTime.DATETIME_MED)}
      </Text>
    </HStack>
  );
};

export const renderLooks = ({ looks, orangeColorMode, getLooks }) => {
  if (looks.get.loading) {
    return renderSkeleton(looks);
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
            <Button onClick={() => getLooks()}>Try Again</Button>
          </VStack>
        </Flex>
      </Box>
    );
  } else if (looks.get.success.data.length) {
    return looks.get.success.data.map((look) => (
      <Box key={look.objectId}>
        <Box
          marginTop={{ base: "1", sm: "5" }}
          marginBottom={{ base: "1", sm: "5" }}
          display="flex"
          flexDirection={{ base: "column", sm: "row" }}
          justifyContent="space-between"
          key={look.objectId}
          padding="20px"
          boxShadow={"md"}
          borderRadius={"10px"}
          bg={"white"}
        >
          {renderCarousel({ orangeColorMode, look })}
          <Box
            display="flex"
            flex="1"
            flexDirection="column"
            justifyContent="flex-start"
            marginTop={{ base: "3", sm: "0" }}
          >
            {/* <BlogTags tags={['Engineering', 'Product']} /> */}
            <Skeleton isLoaded={!looks.get.loading}>
              <Text fontSize="3xl" marginTop="1" textTransform={"capitalize"}>
                <Link
                  textDecoration="none"
                  _hover={{ textDecoration: "none" }}
                  to={`looks/${look.objectId}`}
                >
                  {look.name}
                </Link>
              </Text>

              <LooksCreatedDate date={look.createdAt} />
            </Skeleton>
            {renderLookPoints({ look })}
            <Stack direction="row" spacing={4} marginTop="5">
              <Link to={`looks/${look.objectId}`}>
                <Button
                  bgGradient="linear(to-bl, #594bab,#4d2c58)"
                  isFullWidth
                  leftIcon={<IoCaretForwardOutline />}
                  variant="solid"
                  color="white"
                >
                  View / Modify
                </Button>
              </Link>
            </Stack>
          </Box>
        </Box>
        <Divider marginTop="1em" marginBottom="1em" />
      </Box>
    ));
  } else if (!looks.get.success.data.length) {
    return (
      <Box height="full">
        <Flex direction="column" align="center" px="10">
          <VStack spacing="3">
            <Heading as="h1" size="md" pt="10">
              You have not created any HPAY shopping list yet.
            </Heading>
          </VStack>
          <br />
          <Divider />
          <br />
          <VStack spacing="3">
            <Link to="/looks/create">
              <Button>Create New Curation</Button>
            </Link>
          </VStack>
        </Flex>
      </Box>
    );
  }
  return null;
};

function Looks(props) {
  const looks = useLooksStore((state) => state.looks);
  const getLooks = useLooksStore((state) => state.getLooks);
  const shop = useContext(ShopContext);
  const scripts = useScriptsStore((state) => state.scripts);
  const postScripts = useScriptsStore((state) => state.postScripts);
  const getScripts = useScriptsStore((state) => state.getScripts);
  const destroyScripts = useScriptsStore((state) => state.destroyScripts);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const orangeColorMode = useColorModeValue(
    "radial(orange.600 1px, transparent 1px)",
    "radial(orange.300 1px, transparent 1px)"
  );
  // const getViews = useViewsStore((state) => state.getViews);
  // const viewsState = useViewsStore((state) => state.viewsState);
  const getCharges = useChargesStore((state) => state.getCharges);
  const postCharges = useChargesStore((state) => state.postCharges);
  const chargesState = useChargesStore((state) => state.chargesState);
  const destroyCharges = useChargesStore((state) => state.destroyCharges);
  const postViews = useViewsStore((state) => state.postViews);

  const udpateSubscribedState = async () => {
    try {
      const chargesData = await getCharges({ shop }); // this api  will return both charges and views
      console.log(chargesData);
      const activeCharge = chargesData.recurringApplicationCharges.find(
        (charge) => charge.status === "active"
      );
      if (activeCharge) {
        postViews({ shop, subscribed: true });
      } else {
        postViews({ shop, subscribed: false });
      }
    } catch (e) {}
  };
  useEffect(async () => {
    getLooks();
    getScripts(shop);
    // getViews({ shop });
    udpateSubscribedState();
  }, []);

  const renderWidgetStatusAlert = ({ looks }) => {
    if (!looks.get.success.data.length) {
      return null;
    }

    const enableWidget = async () => {
      try {
        await postScripts(shop);
        toast({
          title: `Widget added successfully! Please visit your online store after 30 seconds to check the widget.`,
          status: "success",
        });
        getScripts(shop);
      } catch (e) {
        toast({
          title: e.message || INTERNAL_SERVER_ERROR,
          status: "error",
        });
      }
    };

    const disableWidget = async () => {
      try {
        await destroyScripts(shop);
        toast({
          title: `Widget removed successfully!`,
          status: "success",
        });
        getScripts(shop);
      } catch (e) {
        toast({
          title: e.message || INTERNAL_SERVER_ERROR,
          status: "error",
        });
      }
    };

    const renderButton = () => {
      if (scripts.get.loading) {
        return (
          <Button colorScheme="gray" isLoading isDisabled>
            Loading ...
          </Button>
        );
      } else if (scripts.get.success.data.length) {
        return (
          <>
            <ChakraLink
              target="_blank"
              href={`http://${shop}#frangout-shop-look-app-wrapper`}
            >
              <Button
                fontWeight="bold"
                size="md"
                colorScheme="green"
                variant="ghost"
                leftIcon={<LinkIcon />}
              >
                Preview Widget
              </Button>
            </ChakraLink>
            <Button
              isLoading={scripts.destroy.loading || scripts.get.loading}
              fontWeight="bold"
              size="md"
              colorScheme="red"
              onClick={disableWidget}
            >
              Remove Widget
            </Button>
          </>
        );
      } else {
        return (
          <Button
            isLoading={scripts.post.loading || scripts.get.loading}
            fontWeight="bold"
            size="md"
            colorScheme="blue"
            onClick={enableWidget}
          >
            Add Widget To Your Store
          </Button>
        );
      }
    };

    const renderScriptStatusText = () => {
      if (scripts.get.loading) {
        return null;
      } else if (scripts.get.success.data.length) {
        return (
          <Flex direction="column">
            <Text>
              "XLM Shop" widget <b>has been added</b> to your store page. &nbsp;
            </Text>
            <Text
              cursor="pointer"
              onClick={onOpen}
              style={{ textDecoration: "underline" }}
            >
              For custom widget position instructions <b>click here.</b>
            </Text>
          </Flex>
        );
      } else {
        return (
          <Text>
            "XLM Shop" widget is <b>not added</b> to your store page.
          </Text>
        );
      }
    };
    return (
      <Alert status="info" boxShadow="md">
        <Flex
          direction="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
          height="100%"
        >
          <Stack>{renderScriptStatusText()}</Stack>
          <ButtonGroup variant="outline" spacing="6">
            {renderButton()}
          </ButtonGroup>
        </Flex>
      </Alert>
    );
  };

  const renderChargesStatusAlert = () => {
    const renderSubscribeButton = () => {
      const activeCharge =
        chargesState.get.success.data.recurringApplicationCharges.find(
          (charge) => charge.status === "active"
        );
      if (activeCharge) {
        return (
          <Button
            isLoading={chargesState.destroy.loading}
            fontWeight="bold"
            size="md"
            colorScheme="red"
            onClick={async () => {
              const data = await destroyCharges({
                chargeId: activeCharge.id,
              });
              getCharges({ shop });
              udpateSubscribedState();
            }}
          >
            Cancel Paid Plan
          </Button>
        );
      } else if (!activeCharge) {
        return (
          <Button
            isLoading={chargesState.post.loading}
            fontWeight="bold"
            size="md"
            colorScheme="blue"
            onClick={async () => {
              const data = await postCharges({
                returnURL: `https://${shop}/admin/apps/${process.env.REACT_APP_SHOPIFY_APP_NAME}`,
              });
              if (data) {
                if (window.self !== window.top) {
                  // checking if it is an iframe
                  window.parent.location.href = data.confirmation_url;
                } else {
                  window.location.href = data.confirmation_url;
                }
              }
            }}
          >
            $4.99/month for unlimited views
          </Button>
        );
      }
    };

    if (chargesState.get.loading) {
      return null;
    } else if (chargesState.get.success.ok) {
      return (
        <Alert status="info">
          <Flex
            direction="row"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
            height="100%"
          >
            <Stack>
              <Text>
                The XLM Shop widget on your store has{" "}
                <b>{chargesState.get.success.data.views.count}</b> views{" "}
              </Text>
              <Text>
                The first 1000 views are free. Please subscribe to our flat
                $4.99/month paid plan for unlimited views.
              </Text>
            </Stack>
            <ButtonGroup variant="outline" spacing="6">
              {renderSubscribeButton()}
            </ButtonGroup>
          </Flex>
        </Alert>
      );
    } else if (chargesState.get.failure.error) {
      return null;
    }
  };

  return (
    <Box height="full">
      {renderWidgetStatusAlert({ looks })}
      <Divider />
      {renderChargesStatusAlert()}
      <Container maxW={"3xl"} height="full">
        {renderLooks({ looks, orangeColorMode, getLooks })}
      </Container>
      <AlertDialog onClose={onClose} isOpen={isOpen} isCentered size="3xl">
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Custom Widget Position</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody textAlign="center">
            If you want the widget only on certain pages or only in certain
            positions please add the following html tag to custom liquid or
            custom html section.
            <br />
            <br />
            <b>
              <Code
                size="xl"
                children={`<div id="frangout-shop-look-app"> </div>`}
              ></Code>
            </b>
            <br />
            <br />
            <iframe
              width="720"
              height="405"
              src="https://www.youtube.com/embed/poWt-ssYDM8"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>Ok</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}

Looks.defaultProps = {};

export default Looks;
