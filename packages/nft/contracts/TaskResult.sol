// SPDX-License-Identifier: PlsBuyMeBeerKthx-1.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

/*
https://github.com/iExecBlockchainComputing/PoCo/blob/482137414f3bcc37d64e6d6362594edc042cdf39/contracts/registries/Registry.sol
This is the Registry?
We need to verify who the dataset owner is
*/

// export const DATASET_REGISTRY_ADDRESS = '0x799DAa22654128d0C64d5b79eac9283008158730';
// export const DataProtector = 0x3a4Ab33F3D605e75b6D00A32A0Fa55C3628F6A59
// DataProtector.registry = 0x799daa22654128d0c64d5b79eac9283008158730

contract TaskResult {
    mapping(address datasetAddress => bytes32 taskId) public datasetTasks;
    IERC721 public immutable registry;

    constructor() {
        registry = IERC721(0x799DAa22654128d0C64d5b79eac9283008158730);
    }

    function associate(address dataset, bytes32 taskId) external {
        require( registry.ownerOf(uint256(uint160(dataset))) == msg.sender, "not owner" );
        datasetTasks[dataset] = taskId;
    }
}
