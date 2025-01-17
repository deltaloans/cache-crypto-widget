import {
  Flex,
  Box,
  Image,
  Text,
  Button,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import SwapButton from './SwapButton';
import TokenSelect from './TokenSelect';
// import TokenModal from './Modal/TokenModal';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import { useEthers } from '@usedapp/core';
import Identicon from './Identicon';
import { useAppContext } from './appContext';
import {
  getCGTBalance,
  getPrice,
  gettoken0Contract,
  getTokenBalance,
  swap,
  getNetwork,
} from '../services/v3service';
import AlertMessage from './AlertMessage';

type Props = {
  handleOpenModal: any;
};
export default function Trade({ handleOpenModal }: Props) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [valueOut, setValueOut] = useState<any>(0);
  const [networkId, setNetworkId] = useState<any>();
  const [CGTcontractBalance, setCGTcontractBalance] = useState('');
  const [txStatus, setTxStatus] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const { ethereum } = window;
  const {
    token,
    setTokenBalance,
    setCGTBalance,
    tokenBalance,
    CGTBalance,
    value,
    setValue,
    alertMsg,
    setalertMsg,
  } = useAppContext();
  const { account } = useEthers();

  async function getNetworkId() {
    if (window.ethereum) {
      const chainId = await getNetwork();
      setNetworkId(chainId['chainId']);
    }
  }
  async function getBalance() {
    if (account && token.address) {
      const tokenBalance = await getTokenBalance(token, account);
      setTokenBalance(tokenBalance!);
    }
  }
  async function getCGTBalanceFunc() {
    if (account) {
      const CGTBalanceData = await getCGTBalance(account);
      setCGTBalance(CGTBalanceData![0]);
      setCGTcontractBalance(CGTBalanceData![1]);
    }
  }
  async function getContract() {
    if (ethereum && token.address) {
      const contract = gettoken0Contract(token.address);
    }
  }
  async function swapTokens({ token, account, value }: any) {
    if (value && token && parseFloat(tokenBalance) >= value) {
      try {
        setTxLoading(true);
        const data = await swap(token!, account!, value!.toString());
        if (data.status === 1) {
          setTxStatus(true);
          setalertMsg('Transaction Successful ! ');
          setTxLoading(false);
        }
      } catch (error) {
        setTxLoading(false);
        setalertMsg('Something went wrong, Please try again !');
      }
    }
  }
  async function predictPrice() {
    if (account && token.address && value) {
      setFetchingPrice(true);
      try {
        await getPrice(value, account, token).then((data) => {
          const outputValue = data![1];
          setValueOut(outputValue);
          // console.log('ratio', 1 / parseFloat(data[2].toString()));
          // setRatio(data![2]);
        });
        setFetchingPrice(false);
      } catch (error: any) {
        setalertMsg('Something Went wrong, please try again!');
        setFetchingPrice(false);
      }
    }
  }

  if (!CGTcontractBalance && !CGTBalance) {
    getCGTBalanceFunc();
  }
  useEffect(() => {
    getContract();
    predictPrice();
    getBalance();
    getNetworkId();
    setalertMsg('');
  }, [token, value, networkId]);

  useEffect(() => {
    if (txStatus) {
      const timer = setTimeout(() => {
        setTxStatus(false);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [txStatus]);

  return (
    <Box
      w="25rem"
      mx="auto"
      mt="5.25rem"
      boxShadow="rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
}"
      borderRadius="1.37rem"
    >
      {/* <TokenModal isOpen={isOpen} onClose={onClose} /> */}

      <Flex
        alignItems="center"
        p="1.5rem 1.25rem 1.5rem"
        bg="#191b1d"
        justifyContent="space-between"
        borderRadius="1.37rem 1.37rem 0 0"
      >
        {/* <SettingsIcon
          color="white"
          fontSize="1.25rem"
          cursor="pointer"
          _hover={{ color: 'rgb(128,128,128)' }}
        /> */}
      </Flex>
      {account && (
        <Flex alignItems="center" justifyContent="center" bg="#191b1d" py="0">
          {/* <Box px="5">
              <Text color="white" fontSize="md">
                {etherBalance &&
                  parseFloat(formatEther(etherBalance)).toFixed(0)}{' '}
                ETH
              </Text>
            </Box> */}

          <Button
            // onClick={handleOpenModal}
            bg="#191b1d"
            border="0.06rem solid rgb(247, 248, 250)"
            _hover={{
              border: '0.06rem',
              borderStyle: 'solid',
              borderColor: 'rgb(211,211,211)',
            }}
            borderRadius="xl"
            m="0.06rem"
            px={3}
            h="2.37rem"
          >
            <Text color="white" fontSize="md" fontWeight="medium" mr="2">
              {account &&
                `${account.slice(0, 6)}...${account.slice(
                  account.length - 4,
                  account.length
                )}`}
            </Text>
            <Identicon />
          </Button>
        </Flex>
      )}

      <Flex
        alignItems="center"
        justifyContent="center"
        bg="#191b1d"
        py="10px"
        pt="15px"
      >
        <Box>
          <Flex direction="column" alignItems="center" gap="5px" px={10}>
            <Text size="xs" color="#fbd03b">
              CGT Widget <br />{' '}
            </Text>
            <Text fontSize={13} color="white">
              A widget for buying CGT using any token at chainlink XAU price +
              margin
            </Text>
            {networkId !== 137 ? (
              <Text fontSize={13} color="red.400">
                ⚠ Please switch to polygon mainnet
              </Text>
            ) : (
              ''
            )}
          </Flex>
        </Box>
      </Flex>

      <Box p="1rem" bg="#191b1d" borderRadius="0 0 1.37rem 1.37rem">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg="#212429"
          p="1.75rem 1rem 1.75rem"
          borderRadius="1.25rem"
          border="none"
        >
          <Box>
            <TokenSelect />
          </Box>
          <Box>
            <Input
              // defaultValue={value}
              placeholder="0.0"
              value={value}
              fontWeight="500"
              fontSize="1.5rem"
              width="100%"
              size="19rem"
              textAlign="right"
              bg="#212429"
              outline="none"
              border="none"
              focusBorderColor="none"
              type="number"
              color="white"
              // disabled={fetchingPrice}
              onChange={function (e) {
                if (e.target.value !== undefined) {
                  setValue(parseFloat(e.target.value));
                }
              }}
            />
            {tokenBalance && (
              <Box
                fontWeight="500"
                pt="4px"
                fontSize="=25rem"
                width="100%"
                textAlign="right"
                bg="#212429"
                outline="none"
                border="none"
                color="white"
              >
                <Flex
                  alignItems="center"
                  justifyContent="end"
                  color="white"
                  gap="5px"
                  fontSize="sm"
                >
                  balance:{' '}
                  <span style={{ color: '#fbd03b' }}>
                    {parseFloat(tokenBalance).toFixed(4)}
                  </span>
                  <Button
                    _hover={{
                      bg: '#212429',
                      borderColor: '#fbd03b',
                      color: '#fbd03b',
                    }}
                    size="xs"
                    variant="outline"
                    onClick={() => setValue(parseFloat(tokenBalance))}
                  >
                    max
                  </Button>
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>

        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg="#212429"
          pos="relative"
          p="1.75rem 1rem 1.75rem"
          borderRadius="1.25rem"
          mt="0.25rem"
          border="none"
        >
          <Box width={'50%'}>
            <Flex gap={2} alignItems="center">
              <Image height={35} width={35} src={logo} />
              <Text color="white" as="b" fontSize="md">
                CGT
              </Text>
            </Flex>
          </Box>
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="#191b1f"
            p="0.3rem"
            borderRadius="0.75rem"
            pos="relative"
            top={tokenBalance || CGTBalance ? '-3.5rem' : '-3rem'}
            left="2.5rem"
          >
            <ArrowDownIcon
              bg="#212429"
              color="#7e8497"
              h="1.5rem"
              width="1.5rem"
              padding="0.2rem"
              borderRadius="0.4rem"
            />
          </Flex>
          <Box>
            <Input
              placeholder="0.0"
              fontSize={valueOut.toString().length >= 18 ? '1rem' : '1.5rem'}
              width="100%"
              size="19rem"
              textAlign="right"
              bg="#212429"
              outline="none"
              border="none"
              focusBorderColor="none"
              type="number"
              color="white"
              isDisabled={true}
              value={valueOut}
            />
            {CGTBalance && (
              <Box
                fontWeight="500"
                pt="4px"
                fontSize="=sm"
                width="100%"
                textAlign="right"
                bg="#212429"
                outline="none"
                border="none"
                color="white"
              >
                <Text fontSize="sm" color="white">
                  balance:{' '}
                  <span style={{ color: '#fbd03b' }}>
                    {' '}
                    {parseFloat(CGTBalance).toFixed(4)}
                  </span>
                </Text>
              </Box>
            )}
          </Box>
        </Flex>
        <Box pt="10px" pb="10px" color="white">
          {fetchingPrice ? (
            <Flex alignItems="center" gap="5px">
              <Spinner size="sm" color="#fbd03b" />
              <Text color="white">fetching price...</Text>
            </Flex>
          ) : txLoading ? (
            <Flex alignItems="center" gap="5px">
              <Spinner size="sm" color="#fbd03b" />
              <Text color="white">Transaction is in progress...</Text>
            </Flex>
          ) : (
            ''
          )}
          {txStatus ? (
            <AlertMessage type={'SUCCESS'} message={alertMsg} />
          ) : (
            <AlertMessage message={alertMsg} />
          )}
        </Box>
        <div
          onClick={() => {
            swapTokens({ token, account, value });
          }}
        >
          <SwapButton txLoading={txLoading} />
        </div>

        <Flex
          alignItems="center"
          justifyContent="center"
          bg="#191b1d"
          py="10px"
          pt="15px"
        >
          <Box>
            {CGTcontractBalance && (
              <Flex alignItems="center" gap="5px">
                <Text color="white">
                  Contract CGT Balance:{' '}
                  <span style={{ color: '#fbd03b' }}>
                    {parseFloat(CGTcontractBalance).toFixed(4)}
                  </span>
                </Text>
                <Image height={25} width={25} src={logo} />
              </Flex>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
