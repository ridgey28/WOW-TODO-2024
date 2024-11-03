import { TodoList } from "./Todo.js";
let list = new TodoList();
const getID = (id) => {
    return document.getElementById(id);
};
const getDate = (val = 0) => {
    let date = new Date();
    date.setDate(date.getDate() + val);
    return date.toISOString().split("T")[0];
};
let date = getID("date");
let submit = getID("submit");
let todo = getID("todo");
if (date) {
    date.setAttribute("min", getDate());
    date.setAttribute("value", getDate());
}
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
const buttonsContainer = getID("buttons");
if (buttonsContainer) {
    buttonsContainer.addEventListener("click", (e) => {
        const target = e.target;
        if (!target)
            return;
        const value = target.id;
        if (value === "today-1") {
            date.value = getDate(1);
        }
        else if (value === "today-7") {
            date.value = getDate(7);
        }
        else if (value === "today") {
            date.value = getDate();
        }
        else if (value === "sort") {
            list.sortList();
        }
        else if (value === "delete-all") {
            let confirmDelete = confirm("Are you sure you want to delete all todos?");
            if (!confirmDelete)
                return;
            list.deleteAll();
            location.reload();
        }
    });
}
