import {
  Box,
  Container,
  Heading,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  VStack,
  Text,
  Divider,
  Flex,
  Button,
  Link,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { StellarHorizonAPIContext, ShopContext } from "../../context";
import useTransactionStore from "../../store/transaction";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
const TransactionRoute = () => {
  const shop = useContext(ShopContext);
  const stellarHorizonAPI = useContext(StellarHorizonAPIContext);

  const transactionState = useTransactionStore(
    (state) => state.transactionState
  );
  const getTransactionState = useTransactionStore(
    (state) => state.getTransactionState
  );

  useEffect(async () => {
    getTransactionState(shop, stellarHorizonAPI);
  }, []);

  const renderTransactions = () => {
    if (transactionState.get.loading) {
      return (
        <>
          <Box padding="6" boxShadow="lg" bg="white">
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </Box>
        </>
      );
    } else if (transactionState.get.success.ok) {
      return (
        <>
          <VStack spacing={2} align="stretch">
            <Box>
              <Text size="xl" fontWeight="bold">
                Payments to your wallet from your store customers
              </Text>
              <Divider borderColor="gray.200" />
            </Box>
          </VStack>

          <TableContainer p="5">
            <Table variant={"striped"}>
              <Thead>
                <Tr>
                  <Th>Amount</Th>
                  <Th>Date</Th>
                  <Th>From</Th>
                  <Th>Status</Th>
                  <Th>Transaction</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactionState.get.success.data.records.map((record) => (
                  <Tr key={record.transaction_hash}>
                    <Td>{parseFloat(record?.amount)?.toFixed(2)}</Td>
                    <Td>
                      {new Date(record.created_at).toLocaleTimeString()}{" "}
                      {new Date(record.created_at).toLocaleDateString()}
                    </Td>
                    <Td isTruncated maxW={100}>
                      {record.from}
                    </Td>
                    <Td>
                      {record.transaction_successful ? (
                        <CheckIcon color="green" />
                      ) : (
                        <CloseIcon color="red" />
                      )}
                    </Td>
                    <Td isTruncated>
                      <Link
                        color="teal"
                        target="_blank"
                        href={`${process.env.REACT_APP_STELLAR_LEDGER_EXPLORER}transactions/${record.transaction_hash}`}
                      >
                        <Text overflow="ellipsis" noOfLines={1} as="u">
                          {record.transaction_hash}
                        </Text>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      );
    } else if (transactionState.get.failure.error) {
      return (
        <Box>
          <Flex direction="column" align="center">
            <VStack spacing="3">
              <Heading as="h1" size="md">
                {transactionState.get.failure.message}
              </Heading>
            </VStack>
            <br />
            <Divider />
            <br />
            <VStack spacing="3">
              <Button
                onClick={() => getTransactionState(shop, stellarHorizonAPI)}
              >
                Try Again
              </Button>
            </VStack>
          </Flex>
        </Box>
      );
    }
  };
  return (
    <>
      <NavBar />
      <Container maxW={"7xl"} p={[12, 6]} minH={"100vh"} bg="#f6f6f7">
        <Box bg="white" width={"5xl"} m="auto" p={5} borderRadius="10px">
          {renderTransactions()}
        </Box>
      </Container>
    </>
  );
};

export default TransactionRoute;
