const Mock_AxS = artifacts.require('MockAxS')

const balances = ['60', '20', '40', '35', '90', '28', '14', '150']
const transfers = ['10', '5', '8', '3', '65', '18', '6', '32']
const burns = ['25', '1', '4', '2', '8', '10', '3', '90']

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Mock_AxS)
  const instance = await Mock_AxS.deployed()

  for (let i = 0; i < balances.length; i++) {
    await instance.mint(accounts[i], web3.utils.toWei(balances[i], 'ether'))
  }
  for (let i = 0; i < transfers.length; i++) {
    await instance.transfer(accounts[getRandomInt(i)], web3.utils.toWei(transfers[i], 'ether'), {
      from: accounts[i],
    })
  }
  for (let i = 0; i < burns.length; i++) {
    console.log('burn')
    await instance.burn(web3.utils.toWei(burns[i], 'ether'), {
      from: accounts[i],
    })
  }
}

function getRandomInt(from) {
  const rand = Math.floor(Math.random() * 10)
  return from !== rand ? rand : rand + 1
}
