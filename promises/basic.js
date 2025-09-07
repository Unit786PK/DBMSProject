function first(){
    console.log(`first Function`)
}
function second(){
    fetch(`https://jsonplaceholder.typicode.com/todos/1`) 
    .then(res => res.json)
    .then(user => console.log(`second Function - ${user.name}`))
   
}
function third(){
    console.log(`third Function`)
}

first()
second()
third()