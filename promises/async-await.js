function first(){
    console.log(`first Function`)
}
async function second(){
    await fetch(`https://jsonplaceholder.typicode.com/users/1`) 
    .then(res => res.json)
    .then(user => console.log(`second Function - ${user.name}`))
   
}
function third(){
    console.log(`third Function`)
}
(async()=>{
    first();
    await second();
    third();
})();