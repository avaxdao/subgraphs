//SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "../@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev THIS CONTRACT IS FOR TESTING PURPOSES ONLY.
 */
contract MockAxS is ERC20 {
    constructor() ERC20("MockAxS", "AxS") {}

    uint256 public cap = 1_000_000_000 ether;
    address public vestingContract; // set -----

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }

    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) external {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }

    function _mint(address account, uint256 amount) internal override {
        require(ERC20.totalSupply() + amount <= cap, "cap exceeded");
        super._mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal override {
        super._burn(account, amount);
        cap -= amount;
    }
}
