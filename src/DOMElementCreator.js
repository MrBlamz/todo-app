export const createList = function (name) {
  const list = document.createElement("div");
  list.classList.add("list");

  const nameElement = document.createElement("p");
  nameElement.classList.add("list-name");
  nameElement.textContent = name;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-list-btn");
  const icon = document.createElement("i");
  icon.classList.add("fas");
  icon.classList.add("fa-times");

  deleteBtn.appendChild(icon);
  list.append(nameElement, deleteBtn);

  return list;
};

export const createTodo = function (name, dueDate, list) {
  const todo = createContainer("todo");
  todo.setAttribute("data-list", list);

  const infoContainer = createContainer("todo-info-container");
  const todoName = createParagraph("todo-name", name);
  infoContainer.appendChild(todoName);

  const dateContainer = createContainer("due-date-container");
  const todoDate = createParagraph("due-date", dueDate);
  dateContainer.appendChild(todoDate);

  const buttonsContainer = createContainer("todo-btn-container");
  const editBtn = createButton("edit-todo-btn");
  const editBtnIcon = createI("fas", "fa-pencil-alt");
  editBtn.appendChild(editBtnIcon);
  const deleteBtn = createButton("delete-todo-btn");
  const deleteBtnIcon = createI("fas", "fa-trash");
  deleteBtn.appendChild(deleteBtnIcon);
  buttonsContainer.append(editBtn, deleteBtn);

  todo.append(infoContainer, dateContainer, buttonsContainer);
  return todo;
};

// Helper functions
function createContainer(className) {
  const container = document.createElement("div");
  container.classList.add(className);
  return container;
}

function createParagraph(className, content) {
  const p = document.createElement("p");
  p.classList.add(className);
  p.textContent = content;
  return p;
}

function createButton(...className) {
  const button = document.createElement("button");
  className.forEach((name) => button.classList.add(name));
  return button;
}

function createI(...className) {
  const i = document.createElement("i");
  className.forEach((name) => i.classList.add(name));
  return i;
}
