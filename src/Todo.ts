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
  private container: HTMLDivElement;
  private emptyMessage: HTMLParagraphElement;
  items: Todo[];
  itemsProxy: Todo[];
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
          this.updateDisplay();
          this.saveLocalStorage();
        }

        return true;
      },
    });

    // Create the list container in the DOM
    const containerClass = [
      "grid",
      "grid-cols-4",
      "gap-3",
      "place-items-stretch",
    ];
    //creates the container for the list
    this.container = this.addDiv(containerClass);
    document.body.append(this.container);

    // Create a "No items" message element
    this.emptyMessage = document.createElement("p");
    this.emptyMessage.textContent = "No items in your Todo List.";
    this.container.appendChild(this.emptyMessage);

    this.updateDisplay(); // Initial check to set up the display
    this.renderList(); // Render list items from stored data
  }

  updateDisplay() {
    if (this.length > 0) {
      this.emptyMessage.classList.add("hidden");
    } else {
      this.emptyMessage.classList.add("block");
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

    this.renderList(); // Re-render sorted items
    this.saveLocalStorage(); // Save sorted order to localStorage
  }

  // Save items to localStorage
  saveLocalStorage() {
    localStorage.setItem("todoItems", JSON.stringify(this.items));
  }

  // Load items from localStorage
  loadLocalStorage() {
    const items = localStorage.getItem("todoItems");
    return items ? JSON.parse(items) : [];
  }

  // Render list items from stored data
  renderList() {
    this.container.innerHTML = ""; // Clear current items in the DOM to prevent duplicates
    this.itemsProxy.forEach((item) => this.addItemToDOM(item));
  }
  // Method to add a new item to the proxy array
  addItem(item: Todo) {
    this.itemsProxy.push(item);
  }
  removeItem(index: number) {
    this.itemsProxy.splice(index, 1);
  }
  completeItem(item: Todo) {
    item.isDone = !item.isDone;
    this.saveLocalStorage();
    this.renderList();
  }

  get length() {
    return this.itemsProxy.length;
  }
  // Method to update the DOM when a new item is added
  addItemToDOM(item: Todo) {
    const itemClass = [
      "bg-slate-900",
      "grid",
      "grid-cols-6",
      "p-4",
      "w-full",
      "rounded-lg",
    ];

    const div = this.addDiv(itemClass);
    const span = this.addSpan();
    span.textContent = item.title;
    div.append(span);
    div.setAttribute("id", "todo_" + this.items.indexOf(item).toString());
    this.container.append(div);
    div.append(this.addCheckbox(item));
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
    checkbox.classList.add("form-checkbox", "h-5", "w-5", "col-span-1");
    checkbox.checked = item.isDone;
    checkbox.addEventListener("change", (e) => {
      if (e.target) {
        this.completeItem(item);
      }
    });
    checkbox.type = "checkbox";
    return checkbox;
  }
}
