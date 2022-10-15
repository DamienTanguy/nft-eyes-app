import { shallowMount } from '@vue/test-utils'
import { ethers } from 'ethers';
import NFTMintComponent from '@/components/NFTMintComponent.vue'
import { generateTestingUtils, generateContractUtils } from "eth-testing"; //https://www.npmjs.com/package/eth-testing?activeTab=readme
import NftContract from '@/artifacts/contracts/Nftcontract.sol/NftcontractName.json';

describe('NFTMintComponent.vue', () => {

  	let wrapper;
    const testingUtils = generateTestingUtils({ providerType: "MetaMask"/*, verbose: { methods: ["mint"], dismissMocked: true }*/    });
    beforeAll(() => {
    	// use this to check the state of anything in the view
    	wrapper = shallowMount(NFTMintComponent);
        // Manually inject the mocked provider in the window as MetaMask does
        global.window.ethereum = testingUtils.getProvider();
    })
    afterEach(() => {
        // Clear all mocks between tests
        testingUtils.clearAllMocks();
        //jest.restoreAllMocks();
    })

  it('the address contract is exisiting', async () => {
    const w = wrapper.find('#contractAddress');
    expect(w.html()).toContain('0xc720D0A0BdcacE217678Cf2D5EdF50D0E305E77a');
  });

  it('the account address should affect the value to userAddress (getAccount function)', async () => {
  	// Start with not connected wallet
    testingUtils.mockNotConnectedWallet();
    // Mock the connection request of MetaMask
    testingUtils.mockRequestAccounts(["0xe14d2f7105f759a100eab6559282083e0d5760ff"])
  	await wrapper.vm.getAccount();
  	expect(wrapper.vm.userAddress).toBe('0xe14d2f7105f759a100eab6559282083e0d5760ff');
  });

  it('the cost and totalSupply should be initialized to 10000000000000000 (0,01 ether) and 5 (initially minted for the owner) (getData function)', async () => {
  	// Start with not connected wallet
    testingUtils.mockNotConnectedWallet();
    // Mock the connection request of MetaMask
    testingUtils.mockRequestAccounts(["0xe14d2f7105f759a100eab6559282083e0d5760ff"]);
    //allows to mock the chain ID / network to which the provider is connected --> 0x3 Ropsten network
    testingUtils.mockChainId("0x3");

  	const abi = NftContract.abi;
	// An address may be optionally given as second argument, advised in case of multiple similar contracts
	const contractTestingUtils = testingUtils.generateContractUtils(abi);

  	await contractTestingUtils.mockCall("cost", ['10000000000000000']);
  	await contractTestingUtils.mockCall("totalSupply", ['5']);

  	await wrapper.vm.getData();

  	expect(wrapper.vm.data.cost).toBe('10000000000000000');
  	expect(wrapper.vm.data.totalSupply).toBe('5');
  });

  it('the button withdaw should not appear if the account is not the contract owner', async () => {
  	// Start with not connected wallet
    testingUtils.mockNotConnectedWallet();
    // Mock the connection request of MetaMask
    testingUtils.mockRequestAccounts(["0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf"]);
    await wrapper.vm.getAccount();
    const container = wrapper.find('.container');
    expect(container.html()).not.toContain('Withdraw');
  });

  it('the button withdaw should appear if the account is the contract owner', async () => {
  	// Start with not connected wallet
    testingUtils.mockNotConnectedWallet();
    // Mock the connection request of MetaMask
    testingUtils.mockRequestAccounts(["0xe14d2f7105f759a100eab6559282083e0d5760ff"]);
    await wrapper.vm.getAccount();
    const container = wrapper.find('.container');
    expect(container.html()).toContain('Withdraw');
  });

  it('setError function', async () => {
  	await wrapper.vm.setError('the error message');
  	const error = wrapper.find('.error');
    expect(error.html()).toContain('the error message');
  });
  
  it('setSuccess function', async () => {
  	await wrapper.vm.setSuccess('the success message');
  	const success = wrapper.find('.success');
    expect(success.html()).toContain('the success message');
  });

  //affect the next test
  /*it('withdraw and mint buttons are called on click', async () => {
  	wrapper.vm.mint = jest.fn();
  	wrapper.vm.withdraw = jest.fn();
  	await wrapper.find('button#mint').trigger('click');
  	await wrapper.find('button#withdraw').trigger('click');
  	expect(wrapper.vm.mint).toBeCalled();
  	expect(wrapper.vm.withdraw).toBeCalled();
  });*/

  /*it('when the user mint 1 NFT, the totalSupply should increment and a successful message should appear (mint funtion)', async () => {
  	
  	// Start with not connected wallet
    testingUtils.mockNotConnectedWallet();
    // Mock the connection request of MetaMask
    const account = testingUtils.mockRequestAccounts(["0xe14d2f7105f759a100eab6559282083e0d5760ff"]);
    //allows to mock the chain ID / network to which the provider is connected --> 0x3 Ropsten network
    testingUtils.mockChainId("0x3");
    // Mock the network to Ethereum main net
	testingUtils.mockBlockNumber("0x3");

  	const abi = NftContract.abi;
	// An address may be optionally given as second argument, advised in case of multiple similar contracts
	const contractTestingUtils = testingUtils.generateContractUtils(abi);
	// Mock a transaction based from the `mint` function of the contract
	let transaction;
	//transaction = await contractTestingUtils.mockCall("mint", account, String('10000000000000000')); //Invalid argument
	//transaction = await contractTestingUtils.mockCall("mint"); //bad result from back end
	//transaction = await contractTestingUtils.mockCall("mint", [account, 1, ethers.utils.parseUnits("0.01", "ether")]); //Invalid argument
	//transaction = await contractTestingUtils.mockTransaction("mint"); //Cannot read properties of undefined (reading 'toLowerCase')
	transaction = await contractTestingUtils.mockTransaction("mint", undefined, {
		triggerCallback: () => {
          contractTestingUtils.mockCall("cost", ['10000000000000000']);
          contractTestingUtils.mockCall("totalSupply", ['5']);
        }
	}); //Cannot read properties of undefined (reading 'toLowerCase')

	await wrapper.vm.mint();

	await wrapper.vm.getData();

	expect(wrapper.vm.data.totalSupply).toBe('6');

  });*/

  /*it('when the owner withdraw the amount of the contract, the balance of the contract should be 0 and a successful message should appear (withdraw function)', async () => {

  	// Start with not connected wallet
    testingUtils.mockNotConnectedWallet();
    // Mock the connection request of MetaMask
    const account = testingUtils.mockRequestAccounts(["0xe14d2f7105f759a100eab6559282083e0d5760ff"]);
    //allows to mock the chain ID / network to which the provider is connected --> 0x3 Ropsten network
    testingUtils.mockChainId("0x3");
    // Mock the network to Ethereum main net
	testingUtils.mockBlockNumber("0x3");

  	const abi = NftContract.abi;
	// An address may be optionally given as second argument, advised in case of multiple similar contracts
	const contractTestingUtils = testingUtils.generateContractUtils(abi);

	const transaction = await contractTestingUtils.mockTransaction("withdraw", '0xc720D0A0BdcacE217678Cf2D5EdF50D0E305E77a');

	//console.log('***********testingUtils address account');
	//console.log(testingUtils.provider.requestMocks.eth_requestAccounts[0].data[0]);

	await wrapper.vm.withdraw();

	const balance = await contractTestingUtils.mockCall("balanceOf", ['0xc720D0A0BdcacE217678Cf2D5EdF50D0E305E77a']);
	//const balance = contractTestingUtils.balanceOf();

	expect(balance).toBe(0);

  });*/

})
