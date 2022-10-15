<template>
  <div class="app">
    <div class="container">
      <p class="error" id="error" v-if="error !== '' ">{{ error }}</p>
      <p class="success" id="success" v-if="success !== '' ">{{ success }}</p>
      <button class="withdraw" id="withdraw" @click="withdraw" v-if="userAddress === ownerAddress">Withdraw</button>
      <div class="banner">
        <img src="@/assets/img/1.png" alt="img" />
        <img src="@/assets/img/2.png" alt="img" />
        <img src="@/assets/img/3.png" alt="img" />
        <img src="@/assets/img/4.png" alt="img" />
        <img src="@/assets/img/5.png" alt="img" />
        <img src="@/assets/img/6.png" alt="img" />
        <img src="@/assets/img/7.png" alt="img" />
        <img src="@/assets/img/8.png" alt="img" />
        <img src="@/assets/img/9.png" alt="img" />
        <img src="@/assets/img/10.png" alt="img" />
      </div>
      <h1>Mint your Eyes NFT</h1>
      <p class="count">{{ data.totalSupply }} / 50</p>
      <p class="cost">Each NFT costs {{ data.cost / 10**18}} eth (without gas fees)</p>
      <button id="mint" @click="mint">Buy your NFT</button>
      <p>Contract: <span id="contractAddress">{{ contractAddress }}</span></p>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import NftContract from '@/artifacts/contracts/Nftcontract.sol/NftcontractName.json';
export default {
  name: 'NFTMintComponent',
  data() {
    return {
      contractAddress: '0xc720D0A0BdcacE217678Cf2D5EdF50D0E305E77a',
      ownerAddress: '0xe14d2f7105f759a100eab6559282083e0d5760ff',
      userAddress: '',
      data: {
        cost: '',
        totalSupply: ''
      },
      error: '',
      success: ''
    }
  },
  mounted(){
    this.getAccount();
    this.getData();
  },
  methods: {
    getAccount: async function(){
      if(typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({method : 'eth_requestAccounts'});
        this.userAddress = accounts[0];
      }
    },
    getData: async function(){
      if(typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(this.contractAddress, NftContract.abi, provider); //new instance of the contract to interact with the function of the contract
        try {
          const cost = await contract.cost();
          const totalSupply = await contract.totalSupply();
          this.data.cost = String(cost);
          this.data.totalSupply = String(totalSupply);
        }
        catch(err) {
          this.setError('An error occured to get the data');
        }
      }
    },
    mint: async function(){
      console.log('**ALERT*****MINT');
      if(typeof window.ethereum !== 'undefined') {
        let accounts = await window.ethereum.request({method : 'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, NftContract.abi, signer);
        try {
          console.log('*******try');
          let overrides = {
            from: accounts[0],
            value: this.data.cost
          }
          console.log('*******overrides');
          console.log(overrides);
          const transaction = await contract.mint(accounts[0], 1, overrides);
          console.log('*******transaction');
          console.log(transaction);
          await transaction.wait();
          console.log('*******transaction finish');
          this.getData();
          this.setSuccess('The NFT mint is successful');
        }
        catch(err) {
          console.log('******************err');
          console.log(err);
          this.setError('An error occured to mint');
        }
      }
    },
    withdraw: async function(){
      console.log('**ALERT*****WITHDRAW');
      if(typeof window.ethereum !== 'undefined') {
        //let accounts = await window.ethereum.request({method : 'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, NftContract.abi, signer);
        try {
          console.log('*******transaction withdraw start');
          console.log('******contract');
          //console.log(contract.address);
          console.log(signer);
          const transaction = await contract.withdraw();
          await transaction.wait();
          console.log('*******transaction withdraw finish');
          this.setSuccess('The withdrawal is successful');
        }
        catch(err) {
          console.log('******************err');
          console.log(err);
          this.setError('An error occured to withdraw');
        }
      }
    },
    setError: async function(message){
      this.error = message;
    },
    setSuccess: async function(message){
      this.success = message;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.app {
  text-align: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.banner {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.count {
  font-size: 2rem;
  font-weight: 700;
}

.cost {
  font-weight: 300;
}

.withdraw {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

button {
  background: rgb(255, 217, 0);
  padding: 1rem 2rem;
  border-radius: 20px;
  font-weight: 700;
  border: 0;
  cursor: pointer;
}
</style>
