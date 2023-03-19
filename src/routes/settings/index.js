import { useEffect, useContext, useState } from "react";
import {
  Box,
  Heading,
  ButtonGroup,
  Text,
  Button,
  Container,
  useToast,
  Code,
  Divider,
  Input,
  FormControl,
  InputLeftElement,
  InputGroup,
  FormHelperText,
  Alert,
  AlertIcon,
  SimpleGrid,
  FormErrorMessage,
  Spinner,
  SkeletonText,
  HStack,
  FormLabel,
} from "@chakra-ui/react";
import StellarSdk from "stellar-sdk";
import useScriptsStore from "../../store/scripts";
import { ShopContext } from "../../context";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import NavBar from "../../components/navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import useWalletStore from "../../store/wallet";

const SettingsRoute = () => {
  const shop = useContext(ShopContext);
  const scripts = useScriptsStore((state) => state.scripts);
  const postScripts = useScriptsStore((state) => state.postScripts);
  const getScripts = useScriptsStore((state) => state.getScripts);
  const destroyScripts = useScriptsStore((state) => state.destroyScripts);
  const toast = useToast();

  const verifyWalletSate = useWalletStore((state) => state.verifyWalletSate);
  const cryptoWalletAddressState = useWalletStore((state) => state.walletState);
  const getWalletAddress = useWalletStore((state) => state.getWalletAddress);
  const postWalletAddress = useWalletStore((state) => state.postWalletAddress);
  const verifyWalletAddress = useWalletStore(
    (state) => state.verifyWalletAddress
  );

  const onSubmitHandler = async (data) => {
    const { walletAddress } = data;
    const isValidKey = StellarSdk.StrKey.isValidEd25519PublicKey(walletAddress);
    if (isValidKey) {
      try {
        await postWalletAddress({ shop, walletAddress });
        toast({
          title: "Wallet address added successfully!",
          status: "success",
          duration: 3000,
        });
      } catch (e) {
        toast({
          title: e.message || "Something went wrong.",
          status: "error",
          duration: 3000,
        });
      }
    } else {
      toast({
        title: "Your XLM Wallet public address is invalid",
        status: "error",
        duration: 3000,
      });
    }
  };

  const connectWallet = () => {
    window.open(
      process.env.REACT_APP_SERVER_URL + "/connect-wallet",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const walletSchema = Yup.object().shape({
    walletAddress: Yup.string().required("Wallet Address is required"),
  });

  const formik = useFormik({
    initialValues: { walletAddress: "" },
    validationSchema: walletSchema,
    onSubmit: (values) => {
      console.log(values);
      if (values) {
        onSubmitHandler(values);
      }
    },
  });

  useEffect(() => {
    getWalletAddress(shop);
    getScripts(shop);
  }, []);

  useEffect(() => {
    formik.setFieldValue(
      "walletAddress",
      cryptoWalletAddressState?.get?.success?.data?.walletAddress || ""
    );
  }, [cryptoWalletAddressState?.get?.success?.data?.walletAddress]);

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
  const CryptoAddressInput = () => {
    if (cryptoWalletAddressState.get.loading) {
      return (
        <Box width={"100%"} alignItems="center">
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </Box>
      );
    } else if (cryptoWalletAddressState.get.success.ok) {
      return (
        <Box>
          <Text size="xl" fontWeight="bold" pb="5px">
            XLM wallet public address where you would receive XLM/USDC from
            customers
          </Text>
          <FormControl
            onSubmit={formik.handleSubmit}
            isInvalid={
              formik.touched.walletAddress && formik.errors.walletAddress
            }
          >
            <FormLabel>Your XLM Wallet Public Key</FormLabel>
            <Input
              id="walletAddress"
              name="walletAddress"
              type="text"
              placeholder="XLM Wallet Public Address"
              onChange={formik.handleChange}
              value={formik.values.walletAddress}
            />

            <FormHelperText size="sm" color={"red"}>
              {formik.touched.walletAddress && formik.errors.walletAddress ? (
                formik.errors.walletAddress
              ) : (
                <FormErrorMessage>
                  Your XLM wallet address is required
                </FormErrorMessage>
              )}
            </FormHelperText>
          </FormControl>

          <HStack>
            <Button
              onClick={formik.handleSubmit}
              isLoading={cryptoWalletAddressState.post.loading}
              type="submit"
              size="sm"
              bgGradient="linear(to-bl, #594bab,#4d2c58)"
              color="white"
              _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
            >
              Save Address
            </Button>
            {/* <Button
              size="sm"
              onClick={() => connectWallet()}
              bgGradient="linear(to-bl, #594bab,#4d2c58)"
              _hover={{ bgGradient: "linear(to-bl, #ada1ed,#8e55a1)" }}
              color="white"
            >
              Connect to XLM Wallet
            </Button> */}
          </HStack>
        </Box>
      );
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
        <Button
          isLoading={scripts.destroy.loading || scripts.get.loading}
          fontWeight="bold"
          size="sm"
          colorScheme="red"
          onClick={disableWidget}
        >
          Remove Widget From Your Store
        </Button>
      );
    } else {
      return (
        <Button
          isLoading={scripts.post.loading || scripts.get.loading}
          fontWeight="bold"
          size="sm"
          bgGradient="linear(to-bl, #594bab,#4d2c58)"
          color="white"
          onClick={enableWidget}
        >
          Add Widget To Your Store
        </Button>
      );
    }
  };

  return (
    <>
      <NavBar />
      <Container
        position={"relative"}
        maxW={"7xl"}
        p={[12, 6]}
        bg="#f6f6f7"
        textAlign={"left"}
      >
        <Box as="section" maxW="3xl" mx="auto">
          <SimpleGrid spacing={4}>
            <Box bg="white" borderRadius={10} p={5} boxShadow="md">
              {CryptoAddressInput()}
            </Box>
            <Box bg="white" borderRadius={10} p={5} boxShadow="md">
              <Text size="xl" fontWeight="bold">
                Widget Embed Settings
              </Text>
              <Text mt="4" fontSize="sm">
                Enable or disable "XLM Shop" widget on your store. The widget
                gets appended to the bottom of your store page above the footer
                on the home page.
              </Text>
              <ButtonGroup mt="4" spacing="6">
                {renderButton()}
              </ButtonGroup>
              <Alert mt={4} status="info">
                <AlertIcon />
                <SimpleGrid>
                  <Box>
                    <Text fontSize="sm">
                      NOTE: If you want the widget only on certain pages or only
                      in certain positions please add the following html tag to
                      custom liquid or custom html section.
                    </Text>
                  </Box>
                  <Box>
                    <Code children={`<div id="xlm-shop-app"> </div>`}></Code>
                  </Box>
                </SimpleGrid>
              </Alert>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
      {/* <Blur
        position={"absolute"}
        top={30}
        left={-10}
        style={{ filter: "blur(70px)" }}
      /> */}
    </>
  );
};

export default SettingsRoute;
