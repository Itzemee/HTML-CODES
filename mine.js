// ============================================
// JAVASCRIPT FUNDAMENTALS GUIDE
// ============================================

// 1. VARIABLES & DATA TYPES
var oldWay = "avoid using var";
let name = "JavaScript"; // block-scoped, preferred
const PI = 3.14159; // constant, cannot be reassigned

// Primitive data types
let string = "Hello";
let number = 42;
let boolean = true;
let undefinedVar; // undefined
let nullVar = null;
let symbol = Symbol("unique");
let bigInt = 100n;

// 2. FUNCTIONS
function greet(name) {
    return `Hello, ${name}!`;
}

const arrowFunction = (x) => x * 2; // Arrow function
const multiLine = (a, b) => {
    const sum = a + b;
    return sum;
};

// 3. OBJECTS & ARRAYS
const person = {
    name: "Alice",
    age: 30,
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
};

const numbers = [1, 2, 3, 4, 5];
numbers.map(n => n * 2); // Array methods
numbers.filter(n => n > 2);

// 4. CONTROL FLOW
if (age >= 18) {
    console.log("Adult");
} else if (age >= 13) {
    console.log("Teenager");
} else {
    console.log("Child");
}

for (let i = 0; i < 5; i++) {
    console.log(i);
}

numbers.forEach(num => console.log(num));

// 5. ASYNC OPERATIONS
async function fetchData() {
    try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

// 6. CLASSES
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound`);
    }
}

class Dog extends Animal {
    speak() {
        console.log(`${this.name} barks`);
    }
}

// 7. MODULES (ES6)
// export const myFunction = () => {};
// import { myFunction } from './module.js';

console.log("JavaScript is versatile and powerful!");