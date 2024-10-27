export class Todo {
  isDone: boolean = false;

  constructor(public title: string, public date: Date) {
    this.title = title;
    this.date = date;
    this.isDone = false;
  }

  get todo(): string {
    return this.todo;
  }
}

export class TodoList {
  container: HTMLDivElement;
  // emptyMessage: HTMLParagraphElement;
  items: Todo[];
  itemsProxy: Todo[];
  storeID: string = "todo-list";
  constructor() {
    // Initialize an array and wrap it in a Proxy
    this.items = this.loadLocalStorage(); // Load items from localStorage
    // this.items = [];
    this.itemsProxy = new Proxy(this.items, {
      set: (target: Todo[], property: string, value: Todo) => {
        // Update the array
        target[Number(property)] = value;

        // If a new item was added, update the DOM
        if (!isNaN(Number(property))) {
          this.addItemToDOM(value);
          this.saveLocalStorage();
          this.updateDisplay();
        }
        return true;
      },
      deleteProperty: (target, property) => {
        target.splice(Number(property), 1); // Remove item and reindex array
        this.saveLocalStorage();
        this.updateDisplay();
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
  createContainer() {
    const containerClass = [
      "grid",
      "md:grid-cols-3",
      "gap-3",
      "place-items-stretch",
    ];
    //creates the container for the list
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

    this.updateDisplay();
    this.saveLocalStorage();
  }
  // Save items to localStorage
  saveLocalStorage() {
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
    return items.map((item) => new Todo(item.title, new Date(item.date)));
  }
  // Method to add a new item to the proxy array
  addItem(item: Todo) {
    this.itemsProxy.push(item);
  }
  removeItem(item: Todo) {
    const index = this.itemsProxy.indexOf(item);
    if (index >= 0) {
      this.itemsProxy.splice(index, 1); // Directly remove item using splice
    }
  }
  deleteAll() {
    this.items.length = 0; // Clear the original array
    this.itemsProxy.length = 0; // Clear the Proxy
    this.saveLocalStorage();
    this.updateDisplay();
  }
  completeItem(item: Todo) {
    item.isDone = !item.isDone;
    this.saveLocalStorage();
  }

  get length() {
    console.log(this.itemsProxy.length);
    return this.itemsProxy.length;
  }
  // Method to update the DOM when a new item is added
  addItemToDOM(item: Todo) {
    const itemClass = [
      "bg-matisse-900",
      "grid",
      "grid-cols-7",
      "p-4",
      "w-full",
      "rounded-lg",
      "items-center",
    ];

    const div = this.addDiv(itemClass);
    const span = this.addSpan();
    span.textContent = item.title;

    if (item.isDone) {
      span.classList.add("line-through");
    }
    if (
      new Date(item.date).toISOString().split("T")[0] ===
      new Date().toISOString().split("T")[0]
    ) {
      div.classList.add("border-2", "border-matisse-400");
    }
    div.setAttribute("id", "todo_" + this.items.indexOf(item).toString());
    this.container.append(div);
    div.append(this.addCheckbox(item));
    div.append(span);
    div.append(this.addDeleteButton(item));
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
    const checkbox = document.createElement("input");
    checkbox.classList.add(
      "form-checkbox",
      "bg-matisse-100",
      "h-5",
      "w-5",
      "col-span-1"
    );
    checkbox.checked = item.isDone;
    checkbox.addEventListener("change", (e) => {
      if (e.target) {
        this.completeItem(item);
      }
    });
    checkbox.type = "checkbox";
    return checkbox;
  }
  addDeleteButton(item: Todo): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add(
      "bg-slate-950",
      "hover:bg-gray-950",
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
