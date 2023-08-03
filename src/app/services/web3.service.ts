import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3!: Web3;
  private account;

  constructor() {
    this.init();
  }

  async init() {
    if (typeof (window as any)?.ethereum != 'undefined') {
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      this.web3 = new Web3((window as any).ethereum);
    } else {
      // If Metamask is not available, then use Infura
      const provider = new Web3.providers.HttpProvider(
        'https://sepolia.infura.io/v3/fc9200258bff4b32b5985b859234e67c'
      );
      this.web3 = new Web3(provider); // does not work; mnemonic?
    }

    const accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];
  }

  getInstance(): Web3 {
    return this.web3;
  }

  getAccount() {
    return this.account;
  }
}
