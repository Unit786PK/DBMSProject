function first() {
  return new Promise((resolve) => resolve(`first Function`));
}
function second() {
  return new Promise((resolve) =>
    fetch(`https://jsonplaceholder.typicode.com/users/1`)
      .then((res) => res.json())
      .then((user) => resolve(`second Function - ${user.name}`))
  );
}
function third() {
  return new Promise((resolve) => resolve(`third Function`));
}

// first(function(){
//     second(function(){
//         third()
// })
//     })

first()
  .then(data => console.log(data))
  .then(() =>
    second()
      .then(data => console.log(data))
      .then(() => third().then(data => console.log(data)))
  );
