import { resolve } from "path"

function first(){
    return Promise(resolve => resolve(`first Function`))

}
function second(){
    return Promise(resolve => 
    fetch(`https://jsonplaceholder.typicode.com/todos/1`) 
    .then(res => res.json())
    .then(user => resolve(`second Function - ${user.name}`))
    )
}
function third(){
    return Promise (resolve => resolve(`third Function`))
}

// first(function(){
//     second(function(){
//         third()
// })
//     })

