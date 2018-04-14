import React, { Component } from 'react';
import RSVPjson from '../../../build/contracts/RSVP.json';
import contract from 'truffle-contract';
import getWeb3 from '../../utils/getWeb3';
import getNetwork from '../../utils/getNetwork';
import { etherScanAccount } from '../../utils/etherScan';
import blockies from 'blockies';


// Components
import Nav from '../../components/Nav';

import './index.css';


class App extends Component {
  componentWillMount() {
    getWeb3.then((({ web3 }) => {
      this.props.context.updateState('SET_WEB3', web3);
      this.props.context.updateState('SET_NETWORK', getNetwork(web3));

      this.initContract();
      // this.initContract('0x9eede2f7a3d9c93e5090b5eaf46ec98056f08f91'); // Ropsten
      this.getBalance();
    }));
  }

  async initContract(address = null) {
    try {
      let truffleContract = null;
      let Contract = null;
      let contractInstance = null;
      let truffleContractContractInstance = null;

      if (!address) {
        truffleContract = contract(RSVPjson);
        truffleContract.setProvider(web3.currentProvider);
        truffleContractContractInstance = await truffleContract.deployed();
      }

      const ABI = RSVPjson.abi;
      const contractAddress = address ? address : truffleContractContractInstance.address;

      Contract = await web3.eth.contract(ABI);
      contractInstance = await Contract.at(contractAddress);

      this.props.context.updateState('SET_CONTRACT', contractInstance);
      contractInstance.owner((err, response) => {
        console.info('Contract Owner:', response);
      });
    }
    catch (err) {
      console.info(err);
    }
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
            <div>
              <a href={this.gotoAccount(web3.eth.accounts[0])}>{ web3.eth.accounts[0] }</a>
            </div>
            <div>{ web3.fromWei(getBalance()) } ETH</div>
          </div>
        </div>
      </main>
    );
  }

  getBalance() {
    const { web3 } = this.props.context;

    web3.eth.getBalance(web3.eth.accounts[0], (err, response) => {
      if (response) {
        this.props.context.updateState('SET_BALANCE', response.toNumber());
      }
    });
  }

  gotoAccount(account) {
    return etherScanAccount(account, this.props.context.network);
  }
}

export default App;
