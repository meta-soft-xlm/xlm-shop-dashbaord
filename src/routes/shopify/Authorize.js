import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Input,
  InputLeftAddon,
  InputGroup,
  Divider,
  Text,
  Image,
  VStack,
  Heading,
} from "@chakra-ui/react";
// import FlagImage from "../../assets/shopify/images/flag.svg";

export default function Authorize() {
  const [storeDomain, setStoreDomain] = useState("");
  const [isShopifySiteURLInvalid, setIsShopifySiteURLInvalid] = useState(false);

  const onAuthorize = () => {
    if (!storeDomain) {
      setIsShopifySiteURLInvalid(true);
      return false;
    }
    window.location.href = `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/shopify?shop=${storeDomain}`;
  };
  return (
    <Box marginTop="24">
      <VStack>
        <Box boxSize="lg">
          <VStack spacing="3">
            {/* <Image boxSize="200px" src={FlagImage}/> */}
            <Heading as="h1" size="md">
              Shopify Store Authentication
            </Heading>
            <Text>The access data to your Shopify site has expired.</Text>
          </VStack>
          <br />
          <Divider />
          <br />
          <VStack spacing="3">
            <FormControl
              id="shopify-site"
              isRequired
              isInvalid={isShopifySiteURLInvalid}
            >
              <FormLabel>Shopify site sub domain</FormLabel>
              <InputGroup>
                <InputLeftAddon children="https://" />
                <Input
                  onChange={(e) => setStoreDomain(e.target.value)}
                  type="text"
                  value={storeDomain}
                  placeholder="yourstore.myshopify.com"
                />
              </InputGroup>
              <FormErrorMessage>This is required</FormErrorMessage>
            </FormControl>
            <Button onClick={onAuthorize} isFullWidth>
              Authorize
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
