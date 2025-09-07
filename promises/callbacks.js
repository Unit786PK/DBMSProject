function first(callback){
    console.log(`first Function`)
    callback();
}
function second(callback){
    fetch(`https://jsonplaceholder.typicode.com/users/1`) 
    .then(res => res.json())
    .then(user => console.log(`second Function - ${user.name}`))
   .then(()=> callback())

}
function third(){
    console.log(`third Function`)
}

first(()=> second(()=> third()))