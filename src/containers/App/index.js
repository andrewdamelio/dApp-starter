import React, { Component } from 'react';
import getWeb3 from '../../utils/getWeb3';
import getNetwork from '../../utils/getNetwork';
import blockies from 'blockies';


// Components
import Nav from '../../components/Nav';

import './index.css';


class App extends Component {
  componentWillMount() {
    getWeb3.then((async ({ web3 }) => {
      this.props.context.updateState('SET_WEB3', web3);
      this.props.context.updateState('SET_NETWORK', getNetwork(web3));


      this.getBalance();
      /* Setup contract */

      // const truffleContract = contract(ContractJSON);
      // truffleContract.setProvider(web3.currentProvider);

      // const truffleContractContractInstance = await truffleContract.deployed();
      // contractInstance.address

      // const ABI = contractJSON.abi;
      // const address = truffleContractContractInstance.address;
      // const Contract = await web3.eth.contract(ABI);
      // const contractInstance = await Contract.at(address);
      // this.props.context.updateState('SET_CONTRACT', contractInstance);
    }));
  }

  render() {
    const { web3, network, getBalance } = this.props.context;

    if (!web3) {
      return null;
    }

    const avatar = blockies({
      seed: web3.eth.accounts[0],
      size: 15
    }).toDataURL();


    return (
      <main className="App">
        <Nav context={this.props.context} />
        <div className="App__content">
          <div>dApp starter 👷</div>

          <div style={{ fontSize: '1rem' }}>Connected to { network }</div>

          <div className="App__web3Account">
            <div><img src={avatar} className="App__avatar" /></div>
            <div>{ web3.eth.accounts[0] }</div>
            <div>{ web3.fromWei(getBalance()) } ETH</div>
          </div>

        </div>
      </main>
    );
  }

  getBalance() {
    web3.eth.getBalance(web3.eth.accounts[0], (err, response) => {
      if (response) {
        this.props.context.updateState('SET_BALANCE', response.toNumber());
      }
    });
  }
}

export default App;
