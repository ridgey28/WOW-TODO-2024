import { Todo, TodoList } from "./Todo.js";
let list = new TodoList();

const getID = (id: string) => {
  return document.getElementById(id);
};

const getDate = (val = 0) => {
  let date = new Date();
  date.setDate(date.getDate() + val);
  return date.toISOString().split("T")[0];
};

// let today = new Date().toISOString().split("T")[0];
let date = getID("date") as HTMLInputElement;
let submit = getID("submit");
let todo = getID("todo") as HTMLInputElement;
let sortBtn = getID("sort") as HTMLButtonElement;
let deleteAll = getID("delete-all") as HTMLButtonElement;
let today_1 = getID("today-1") as HTMLButtonElement;
let today_7 = getID("today-7") as HTMLButtonElement;

//Sets date to today in date input
if (date) {
  date.setAttribute("min", getDate());
  date.setAttribute("value", getDate());
}

if (submit) {
  submit.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Submit Clicked");
    console.log("Todo:", e);
    if (todo.value === "" || date.value === "") {
      alert("Please enter a todo and a date");
      return;
    }
    list.addItem(new Todo(todo.value, new Date(date.value)));
    todo.value = "";
  });
}
if (sortBtn) {
  sortBtn.addEventListener("click", function (e) {
    list.sortList();
  });
}
if (today_1) {
  today_1.addEventListener("click", function (e) {
    date.value = getDate(1);
  });
}
if (today_7) {
  today_7.addEventListener("click", function (e) {
    date.value = getDate(7);
  });
}
if (deleteAll) {
  deleteAll.addEventListener("click", function (e) {
    let confirmDelete = confirm("Are you sure you want to delete all todos?");
    if (!confirmDelete) return;
    list.deleteAll();
    location.reload();
  });
}
