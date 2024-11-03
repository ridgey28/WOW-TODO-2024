class Todo {
    title;
    date;
    isDone;
    id;
    constructor(title, date) {
        this.title = title;
        this.date = date;
        this.isDone = false;
        this.id =
            new Date().getTime() + Math.floor(Math.random() * 1000).toString();
    }
    get todo() {
        return this.todo;
    }
}
export class TodoList {
    container;
    items;
    itemsProxy;
    storeID = "todo-list";
    itemID = "todo-item-";
    constructor() {
        this.items = this.loadLocalStorage();
        this.itemsProxy = new Proxy(this.items, {
            set: (target, property, value) => {
                target[Number(property)] = value;
                if (!isNaN(Number(property))) {
                    this.addItemToDOM(value);
                    this.saveUpdate();
                }
                return true;
            },
            deleteProperty: (target, property) => {
                target.splice(Number(property), 1);
                this.saveUpdate();
                return true;
            },
        });
        this.container = this.createContainer();
        this.updateDisplay();
        document.body.append(this.container);
    }
    createEmptyMessage() {
        let p = document.createElement("p");
        p.textContent = "No items in your Todo List.";
        return p;
    }
    saveUpdate() {
        this.saveLocalStorage();
        this.updateDisplay();
    }
    createContainer() {
        const containerClass = [
            "grid",
            "md:grid-cols-3",
            "gap-3",
            "place-items-stretch",
        ];
        return this.addDiv(containerClass);
    }
    updateDisplay() {
        this.container.innerHTML = "";
        let emptyMessage = this.createEmptyMessage();
        this.container.append(emptyMessage);
        if (this.length > 0) {
            emptyMessage.classList.add("hidden");
            this.itemsProxy.forEach((item) => this.addItemToDOM(item));
        }
        else {
            emptyMessage.classList.add("block");
        }
    }
    sortList(order = "asc") {
        this.itemsProxy.sort((a, b) => {
            let dateA = new Date(a.date).valueOf();
            let dateB = new Date(b.date).valueOf();
            return order === "asc"
                ? dateA - dateB
                : dateB - dateA;
        });
        this.saveUpdate();
    }
    saveLocalStorage() {
        console.log("Saving to local storage");
        localStorage.setItem(this.storeID, JSON.stringify(this.items));
    }
    emptyLocalStorage() {
        localStorage.removeItem(this.storeID);
        this.updateDisplay();
    }
    loadLocalStorage() {
        const items = JSON.parse(localStorage.getItem(this.storeID) || "[]");
        return items.map((item) => {
            const todo = new Todo(item.title, new Date(item.date));
            todo.isDone = item.isDone;
            return todo;
        });
    }
    addItem(title, date) {
        const todo = new Todo(title, date);
        this.itemsProxy.push(todo);
    }
    removeItem(item) {
        const index = this.itemsProxy.indexOf(item);
        if (index >= 0)
            this.itemsProxy.splice(index, 1);
    }
    deleteAll() {
        this.items.length = 0;
        this.itemsProxy.length = 0;
        this.saveUpdate();
    }
    completeItem(item) {
        item.isDone = !item.isDone;
        this.saveUpdate();
    }
    get length() {
        return this.itemsProxy.length;
    }
    getDate(date) {
        return date.toISOString().split("T")[0];
    }
    addItemToDOM(item) {
        const itemClass = [
            "dark:bg-matisse-900",
            "bg-matisse-200",
            "grid",
            "grid-cols-7",
            "p-4",
            "w-full",
            "rounded-lg",
            "items-center",
        ];
        const div = this.addDiv(itemClass);
        const span = this.addSpan();
        const checkbox = this.addCheckbox(item);
        const p = document.createElement("p");
        p.textContent = item.title;
        p.classList.add("text-lg");
        const date = document.createElement("span");
        date.textContent = item.date.toDateString();
        date.classList.add("text-sm", "text-gray-500", "block");
        span.append(p, date);
        div.setAttribute("id", this.itemID + item.id.toString());
        this.container.append(div);
        let today = this.getDate(new Date());
        let itemDate = this.getDate(item.date);
        if (itemDate < today) {
            div.classList.add("border-2", "border-rose-400");
        }
        else if (itemDate === today) {
            div.classList.add("border-2", "border-matisse-400");
        }
        item.isDone
            ? p.classList.add("line-through")
            : p.classList.remove("line-through");
        div.append(checkbox, span, this.addDeleteButton(item));
    }
    addDiv(classList) {
        const div = document.createElement("div");
        div.classList.add(...classList);
        return div;
    }
    addSpan() {
        const span = document.createElement("span");
        span.classList.add("col-span-5");
        return span;
    }
    addCheckbox(item) {
        console.log("Adding checkbox function", item.isDone);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("form-checkbox", "bg-matisse-100", "h-5", "w-5", "col-span-1");
        checkbox.addEventListener("change", (e) => {
            if (e.target) {
                this.completeItem(item);
            }
        });
        checkbox.defaultChecked = item.isDone;
        return checkbox;
    }
    addDeleteButton(item) {
        const button = document.createElement("button");
        button.classList.add("bg-matisse-300", "hover:bg-matisse-400", "dark:bg-matisse-800", "hover:bg-matisse-700", "text-white", "p-2", "rounded-lg", "col-span-1");
        button.textContent = "🗑️";
        button.addEventListener("click", (e) => {
            this.removeItem(item);
            this.updateDisplay();
        });
        return button;
    }
}
