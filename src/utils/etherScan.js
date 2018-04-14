export function etherScanTx(tx, network) {
  let url = `https://localhost/tx/${tx}`;

  if (network === 'Mainnet') {
    url = `https://etherscan.io/tx/${tx}`;
  }
  else if (network === 'Ropsten') {
    url = `https://ropsten.etherscan.io/tx/${tx}`;
  }
  else if (network === 'Rinkeby') {
    url = `https://rinkeby.etherscan.io/tx/${tx}`;
  }
  else if (network === 'Kovan') {
    url = `https://kovan.etherscan.io/tx/${tx}`;
  }

  return url;
}

export function etherScanAccount(account, network) {
  let url = `https://localhost/address/${account}`;

  if (network === 'Mainnet') {
    url = `https://etherscan.io/address/${account}`;
  }
  else if (network === 'Ropsten') {
    url = `https://ropsten.etherscan.io/address/${account}`;
  }
  else if (network === 'Rinkeby') {
    url = `https://rinkeby.etherscan.io/address/${account}`;
  }
  else if (network === 'Kovan') {
    url = `https://kovan.etherscan.io/address/${account}`;
  }

  return url;
}


