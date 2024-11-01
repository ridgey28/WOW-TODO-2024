class Todo {
  title: string;
  date: Date;
  isDone: boolean;
  id: string;

  constructor(title: string, date: Date) {
    this.title = title;
    this.date = date;
    this.isDone = false;
    this.id =
      new Date().getTime() + Math.floor(Math.random() * 1000).toString();
  }
  get todo(): string {
    return this.todo;
  }
}

export class TodoList {
  container: HTMLDivElement;
  items: Todo[];
  itemsProxy: Todo[];
  storeID: string = "todo-list";
  itemID: string = "todo-item-";

  constructor() {
    // Initialize an array and wrap it in a Proxy
    this.items = this.loadLocalStorage(); // Load items from localStorage
    this.itemsProxy = new Proxy(this.items, {
      set: (target: Todo[], property: string, value: Todo) => {
        // Update the array
        target[Number(property)] = value;

        // If a new item was added, update the DOM
        if (!isNaN(Number(property))) {
          this.addItemToDOM(value);
          this.saveUpdate();
        }
        return true;
      },
      deleteProperty: (target, property) => {
        target.splice(Number(property), 1); // Remove item and reindex array
        this.saveUpdate();
        return true;
      },
    });
    this.container = this.createContainer(); // Create the container for the list
    this.updateDisplay(); // Initial check to set up the display
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
    this.container.innerHTML = ""; // Clear current items in the DOM to prevent duplicates
    let emptyMessage = this.createEmptyMessage(); // Create the empty message element
    this.container.append(emptyMessage);

    if (this.length > 0) {
      emptyMessage.classList.add("hidden");
      this.itemsProxy.forEach((item) => this.addItemToDOM(item));
    } else {
      emptyMessage.classList.add("block");
    }
  }

  sortList(order: string = "asc") {
    this.itemsProxy.sort((a, b) => {
      let dateA = new Date(a.date).valueOf();
      let dateB = new Date(b.date).valueOf();
      return order === "asc"
        ? dateA - dateB // Ascending order (earliest to latest)
        : dateB - dateA; // Descending order (latest to earliest)
    });

    this.saveUpdate();
  }
  // Save items to localStorage
  saveLocalStorage() {
    console.log("Saving to local storage");
    localStorage.setItem(this.storeID, JSON.stringify(this.items));
  }
  emptyLocalStorage() {
    localStorage.removeItem(this.storeID);
    this.updateDisplay();
  }
  // Load items from localStorage
  loadLocalStorage() {
    const items: Todo[] = JSON.parse(
      localStorage.getItem(this.storeID) || "[]"
    );
    return items.map((item) => {
      const todo = new Todo(item.title, new Date(item.date));
      todo.isDone = item.isDone;
      return todo;
    });
  }
  // Method to add a new item to the proxy array
  addItem(title: string, date: Date) {
    const todo = new Todo(title, date);
    this.itemsProxy.push(todo);
  }
  removeItem(item: Todo) {
    const index = this.itemsProxy.indexOf(item); // Find the index of the item
    if (index >= 0) this.itemsProxy.splice(index, 1); // Directly remove item using splice
  }
  deleteAll() {
    this.items.length = 0;
    this.itemsProxy.length = 0;
    this.saveUpdate();
  }
  completeItem(item: Todo) {
    item.isDone = !item.isDone;
    this.saveUpdate();
  }

  get length() {
    return this.itemsProxy.length;
  }

  getDate(date: Date) {
    return date.toISOString().split("T")[0];
  }
  // Method to update the DOM when a new item is added
  addItemToDOM(item: Todo) {
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
    } else if (itemDate === today) {
      div.classList.add("border-2", "border-matisse-400");
    }
    item.isDone
      ? p.classList.add("line-through")
      : p.classList.remove("line-through");
    div.append(checkbox, span, this.addDeleteButton(item));
  }

  addDiv(classList: string[]): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add(...classList);
    return div;
  }

  addSpan(): HTMLSpanElement {
    const span = document.createElement("span");
    span.classList.add("col-span-5");
    return span;
  }

  addCheckbox(item: Todo): HTMLInputElement {
    console.log("Adding checkbox function", item.isDone);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add(
      "form-checkbox",
      "bg-matisse-100",
      "h-5",
      "w-5",
      "col-span-1"
    );
    checkbox.addEventListener("change", (e) => {
      if (e.target) {
        this.completeItem(item);
      }
    });
    checkbox.defaultChecked = item.isDone;
    return checkbox;
  }
  addDeleteButton(item: Todo): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add(
      "bg-matisse-300",
      "hover:bg-matisse-400",
      "dark:bg-matisse-800",
      "hover:bg-matisse-700",
      "text-white",
      "p-2",
      "rounded-lg",
      "col-span-1"
    );
    button.textContent = "🗑️";
    button.addEventListener("click", (e) => {
      this.removeItem(item);
      this.updateDisplay();
    });
    return button;
  }
}
