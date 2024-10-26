import { Todo, TodoList } from "./Todo.js";
let list = new TodoList();

const getID = (id: string) => {
  return document.getElementById(id);
};

let today = new Date().toISOString().split("T")[0];

let date = getID("date") as HTMLInputElement;
let submit = getID("submit");
let todo = getID("todo") as HTMLInputElement;
let sort = getID("sort") as HTMLButtonElement;
// let checkbox = document.querySelectorAll(".form-checkbox");

//Sets date to today in date input
if (date) {
  date.setAttribute("min", today);
  date.setAttribute("value", today);
}

if (submit) {
  submit.addEventListener("click", function (e) {
    e.preventDefault();
    let todoDate = new Date(date.value);
    console.log("Date:", todoDate);
    list.addItem(new Todo(todo.value, todoDate));
    todo.value = "";
  });
}
if (sort) {
  sort.addEventListener("click", function (e) {
    list.sortList();
  });
}

console.dir(list);
console.log("Todo List Length:", list.length);
