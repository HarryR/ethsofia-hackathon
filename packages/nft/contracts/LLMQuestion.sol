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

    Questionnaire[] private theList;

    function count() external view returns (uint) {
        return theList.length;
    }

    function create(Questionnaire calldata x) external {
        theList.push(x);
    }

    function getList() external view returns (Questionnaire[] memory) {
        return theList;
    }

    function getTitles() external view returns (string[] memory out) {
        uint n = theList.length;
        out = new string[](n);
        for( uint i = 0; i < n; i++ ) {
            out[i] = theList[i].title;
        }
    }

    function getOne(uint n) external view returns (Questionnaire memory out) {
        out = theList[n];
    }
}
