global = this

let instance = await Mock_AxS.deployed()

await instance.mint(accounts[0], 15)
await instance.mint(accounts[1], 44)
await instance.mint(accounts[2], 90)
