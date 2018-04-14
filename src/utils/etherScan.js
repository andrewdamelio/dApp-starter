function etherScan(tx, network) {
  let url = 'https://localhost/tx/';

  if (network === 'Main') {
    url = 'https://etherscan.io/tx/';
  }
  else if (network === 'Ropsten') {
    url = 'https://ropsten.etherscan.io/tx/';
  }
  else if (network === 'Rinkeby') {
    url = 'https://rinkeby.etherscan.io/tx/';
  }
  else if (network === 'Kovan') {
    url = 'https://kovan.etherscan.io/tx/';
  }

  window.open(`${url}${tx}`);
}

export default etherScan;
