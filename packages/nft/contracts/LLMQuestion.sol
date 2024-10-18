// SPDX-License-Identifier: Only-Pirates-Can-Copy-This.divx

pragma solidity ^0.8.0;

contract LLMQuestion {
    struct Question {
        string title;
        string qtype;
        string options;
    }

    struct Questionnaire {
        address owner;
        string title;
        Question[] questions;
    }

    Questionnaire[] public theList;

    function count() external view returns (uint) {
        return theList.length;
    }

    function create(Questionnaire calldata x) external {
        theList.push(x);
    }
}
