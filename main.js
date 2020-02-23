"use strict";

// const versionNumber = "0.1.0";
// let result = prompt("what is the version number?", versionNumber)
// alert(`the version number is ${result}`);

function sayHello() {
    let name = prompt("what is your name?", "");
    if (name == null || name == "") {
        return;
    } else {
        alert(`Hello, ${name}.`);
    }
}