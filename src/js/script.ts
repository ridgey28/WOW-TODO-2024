import { TodoList } from "./Todo.js";
let list = new TodoList();

/**
 * getID function to get elements by id
 * @param id
 * @returns element
 */
const getID = (id: string) => {
  return document.getElementById(id);
};
/**
 * getDate function to get the date and convert it to a string
 * @param val
 * @returns string
 */
const getDate = (val: number = 0) => {
  let date = new Date();
  date.setDate(date.getDate() + val);
  return date.toISOString().split("T")[0];
};

let date = getID("date") as HTMLInputElement;
let submit = getID("submit") as HTMLButtonElement;
let todo = getID("todo") as HTMLInputElement;

//Sets date to today in date input
if (date) {
  date.setAttribute("min", getDate());
  date.setAttribute("value", getDate());
}

/**
 * Event listener for the submit button
 */
if (submit) {
  submit.addEventListener("click", function (e) {
    e.preventDefault();
    if (todo.value === "" || date.value === "") {
      alert("Please enter a todo and a date");
      return;
    }
    list.addItem(todo.value, new Date(date.value));
    todo.value = "";
  });
}
/**
 * Event listener for the buttons container
 */
const buttonsContainer = getID("buttons");
if (buttonsContainer) {
  buttonsContainer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target) return;
    const value = target.id;
    if (value === "today-1") {
      date.value = getDate(1);
    } else if (value === "today-7") {
      date.value = getDate(7);
    } else if (value === "today") {
      date.value = getDate();
    } else if (value === "sort") {
      list.sortList();
    } else if (value === "delete-all") {
      let confirmDelete = confirm("Are you sure you want to delete all todos?");
      if (!confirmDelete) return;
      list.deleteAll();
      location.reload();
    }
  });
}
