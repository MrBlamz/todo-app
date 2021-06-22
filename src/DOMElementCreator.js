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
