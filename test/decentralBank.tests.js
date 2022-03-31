
const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');


require('chai')
.use(require('chai-as-promised'))
.should()
contract('DecentralBank',([owner, customer]) => {

  let tether, rwd, decentralBank

  function tokens(number) {
    return web3.utils.toWei(number, 'ether')
  }

  before(async () => {
    tether = await Tether.new()
     rwd = await RWD.new()
     decentralBank = await DecentralBank.new(rwd.address, tether.address)

     await rwd.transfer(decentralBank.address, tokens('1000000'))

     await tether.transfer(customer, tokens('100'), {from: owner})
  })

  describe('Tether Token Deployement', async () => {
      it('matches name successfully', async ()=> {
         const name = await tether.name()
         assert.equal(name, 'Tether Token')

      })
  })

  describe('Reward Token Deployement', async () => {
    it('matches name successfully', async ()=> {
       const name = await rwd.name()
       assert.equal(name, 'Reward Token')

    })
})

describe('Decentral Bank Deployement', async () => {
  it('matches name successfully', async ()=> {
     const name = await decentralBank.name()
     assert.equal(name, 'Decentral Bank')
     
  })

  it('contract has tokens', async () => {
    let balance = await rwd.balanceOf(decentralBank.address)
    assert.equal(balance, tokens('1000000'))
  })

  describe('Yield Farming', async () =>{
    it('reward tokens for staking', async () =>{
      let result
          result = await tether.balanceOf(customer)
          assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')

          await tether.approve(decentralBank.address, tokens('100'), {from:customer})
          await decentralBank.depositTokens(tokens('100'), {from:customer})

          result = await tether.balanceOf(customer)
          assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking')

          result = await tether.balanceOf(decentralBank.address)
          assert.equal(result.toString(), tokens('100'), 'decentral Bank mock wallet balance after staking from customer')

          
          result = await decentralBank.isStaking(customer)
          assert.equal(result.toString(), 'true', 'customer is staking status after staking')

          await decentralBank.issueTokens({from:owner})

          await decentralBank.issueTokens({from:customer}).should.be.rejected;

          await decentralBank.unstakeTokens({from:customer})

          result = await tether.balanceOf(customer)
          assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking')

          result = await tether.balanceOf(decentralBank.address)
          assert.equal(result.toString(), tokens('0'), 'decentral Bank mock wallet balance after staking from customer')

          
          result = await decentralBank.isStaking(customer)
          assert.equal(result.toString(), 'false', 'customer is no longer staking status after unstaking')
      

         })

      })

   })

})