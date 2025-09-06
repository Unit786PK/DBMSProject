//classic function
function add(num1, num2){
    return num1 + num2;
}

console.log(add(1,2));

// Anonymous Function
(function(num1, num2){
    return num1 + num2;
})();

// Arrow Functions

((num1, num2)=>{
    return num1 + num2;
})();
(()=>num1 + num2)();