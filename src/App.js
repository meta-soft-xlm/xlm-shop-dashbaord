import { useState, useEffect } from "react";
import { Flex, Skeleton, Box, Container, Text } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import NavBar from "./components/navbar";
import LooksRoute from "./routes/looks";
import { parseQuery } from "./utils/url";
import Authorize from "./routes/shopify/Authorize";
import Parse from "parse";
function App() {
  const [shopifySessionAvailable, setShopifySessionAvailable] = useState(false);
  const [shopifyHmacAvailable, setShopifyHmacAvailable] = useState(false);
  const [shopifyCodeAvailable, setShopifyCodeAvailable] = useState(false);
  const [shopifyHostAvailable, setShopifyHostAvailable] = useState(false);

  // if ('storage' in navigator && 'estimate' in navigator.storage) {
  //   navigator.storage.estimate().then(data => {
  //     const {usage, quota} = data;
  //     console.log(`Using ${usage} out of ${quota} bytes.`);
  //     if(quota <= 1003575331){
  //       console.log('Incognito')
  //   } else {
  //       try {
  //         Parse.User.logOut();
  //       } catch (e) {

  //       }
  //   }
  //   })
  // } else {
  //     console.log('Can not detect incognito')
  // }

  const [isEmbed, setIsEmbed] = useState(false);
  useEffect(() => {
    const {
      code,
      session,
      hmac,
      embed,
      host = "",
      userToken,
    } = parseQuery(window.location.search);
    window.lookbook = parseQuery(window.location.search);
    if (session) {
      setShopifySessionAvailable(true);
      setShopifyHmacAvailable(false);
      setShopifyCodeAvailable(false);
      setShopifyHostAvailable(false);
    } else if (code) {
      setShopifySessionAvailable(false);
      setShopifyHmacAvailable(false);
      setShopifyCodeAvailable(true);
      setShopifyHostAvailable(false);
      window.location.replace(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/shopify/callback${document.location.search}`
      );
    } else if (hmac) {
      setShopifySessionAvailable(false);
      setShopifyHmacAvailable(true);
      setShopifyCodeAvailable(false);
      setShopifyHostAvailable(false);
      window.location.replace(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/shopify${document.location.search}`
      );
    } else if (host && !code && !hmac) {
      setShopifyHostAvailable(true);
      setShopifySessionAvailable(false);
      setShopifyHmacAvailable(false);
      setShopifyCodeAvailable(false);
    } else if (embed) {
      setIsEmbed(true);
      setShopifySessionAvailable(false);
      setShopifyHmacAvailable(false);
      setShopifyCodeAvailable(false);
      setShopifyHostAvailable(false);
    }

    if (userToken) {
      // if (Parse.User.current()) {
      //   if (Parse.User.current().get('sessionToken') !== userToken) {
      //     Parse.User.logOut().then(() => Parse.User.become(userToken)).catch(() => Parse.User.become(userToken))
      //   }
      // } else {
      //   Parse.User.become(userToken);
      // }
    } else {
    }
  }, []);

  if (shopifySessionAvailable) {
    return (
      <Box bg="#f6f6f7" height="full">
        <NavBar />
        <LooksRoute />
      </Box>
    );
  } else if (isEmbed) {
    return <Navigate to="/embed" replace />;
  } else if (
    shopifyHmacAvailable ||
    shopifyCodeAvailable ||
    shopifyHostAvailable
  ) {
    return (
      <Container maxW={"7xl"} p="12">
        <Flex alignItems="flex-start" flexDirection="row">
          <Skeleton>
            <Box></Box>
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
      </Container>
    );
  } else {
    return <Authorize />;
  }
}

export default App;
