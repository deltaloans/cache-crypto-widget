import { Button, Box } from '@chakra-ui/react';
import { useEtherBalance, useEthers } from '@usedapp/core';
import wrapperContractAbi from '../wrapperContract.json';
import { ethers } from 'ethers';
import { useAppContext } from './appContext';

export default function SwapButton() {
  const { activateBrowserWallet, account } = useEthers();
  const { token } = useAppContext();
  console.log(token);
  const etherBalance = useEtherBalance(account);
  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    token.name ? (
      <Box mt="0.5rem">
        <Button
          color="black"
          bg="#fbd03b"
          width="100%"
          p="1.62rem"
          borderRadius="1.25rem"
          _hover={{ bg: '#fbd03bbf' }}
        >
          SWAP
        </Button>
      </Box>
    ) : (
      <Box mt="0.5rem">
        <Button
          color="black"
          bg="#fbd03b"
          width="100%"
          p="1.62rem"
          borderRadius="1.25rem"
          _hover={{ bg: '#fbd03bbf' }}
        >
          Please select token
        </Button>
      </Box>
    )
  ) : (
    <Box mt="0.5rem">
      <Button
        onClick={handleConnectWallet}
        color="black"
        bg="#fbd03b"
        width="100%"
        p="1.62rem"
        borderRadius="1.25rem"
        _hover={{ bg: '#fbd03bbf' }}
      >
        Connect Wallet
      </Button>
    </Box>
  );
}
