import PubSub from "pubsub-js";
import {
  todoFormContainer,
  contentContainer,
  topBar,
  sideBar,
  listsContainer,
  newListNameInput,
  todoContainer,
  todoForm,
  listViewName,
  todoOverviewContainer,
  todoOverviewInfoName,
  todoOverviewInfoDate,
  todoOverviewInfoList,
  todoOverviewInfoNotes,
  todoOverviewInfoPriority,
  todoFormNameInput,
  todoFormDateInput,
  todoFormPriorityInput,
  todoFormNotesInput,
  todoFormTitle,
} from "./DOMElements";
import { createList, createTodo } from "./DOMElementCreator";

const DOMHandler = (function () {
  function init() {
    toggleSidebar();
    alertListNameInvalid();
    alertListNameUnavailable();
    addList();
    deleteList();
    clearNewListInput();
    renderList();
    openNewTodoForm();
    closeTodoForm();
    renderTodo();
    resetTodoForm();
    alertTodoNameInvalid();
    alertTodoNameUnavailable();
    renderTodoOverview();
    closeTodoOverview();
    toggleTodoCompleted();
    deleteTodo();
    openEditTodoForm();
    editTodo();
  }

  function toggleSidebar() {
    const TOPIC = "toggleSidebar";

    PubSub.subscribe(TOPIC, () => {
      toggleElementClass(sideBar, "active");
    });
  }

  function alertListNameInvalid() {
    const TOPIC = "listNameInvalid";

    PubSub.subscribe(TOPIC, (msg, name) => {
      if (name.length === 0) {
        alertNameEmpty("List");
      } else {
        alertNameInvalid(name, 20);
      }
    });
  }

  function alertListNameUnavailable() {
    const TOPIC = "listNameUnavailable";

    PubSub.subscribe(TOPIC, (msg, name) => {
      alertNameUnavailable(name, "list");
    });
  }

  function addList() {
    const TOPIC = "listAdded";

    PubSub.subscribe(TOPIC, (msg, name) => {
      const list = createList(name);
      listsContainer.appendChild(list);
    });
  }

  function deleteList() {
    const TOPIC = "listDeleted";

    PubSub.subscribe(TOPIC, (msg, data) => {
      listsContainer.removeChild(data.listElement);
    });
  }

  function clearNewListInput() {
    const TOPIC = "listAdded";

    PubSub.subscribe(TOPIC, () => {
      clearInput(newListNameInput);
    });
  }

  function renderList() {
    const TOPIC = "listFound";

    PubSub.subscribe(TOPIC, (msg, list) => {
      clearTodoContainer();
      updateListViewHeader(list.getName());

      list.getTodos().forEach((todo) => {
        const t = createTodo(todo.getName(), todo.getDueDate(), list.getName());
        todoContainer.appendChild(t);
      });
    });
  }

  function openNewTodoForm() {
    const TOPIC = "openNewTodoForm";

    PubSub.subscribe(TOPIC, () => {
      setTextContent(todoFormTitle, "New Todo");
      toggleElementClass(todoFormContainer, "active");
      blurBackground();
    });
  }

  function closeTodoForm() {
    const TOPIC = "closeTodoForm";

    PubSub.subscribe(TOPIC, () => {
      toggleElementClass(todoFormContainer, "active");
      blurBackground();
      const NEW_TOPIC = "resetForm";
      PubSub.publish(NEW_TOPIC);
    });
  }

  function renderTodo() {
    const TOPIC = "todoAdded";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const todo = createTodo(data.form.name, data.form.dueDate, data.listName);
      todoContainer.appendChild(todo);
      const NEW_TOPIC = "resetForm";
      const SECOND_TOPIC = "closeTodoForm";
      PubSub.publish(NEW_TOPIC);
      PubSub.publish(SECOND_TOPIC);
    });
  }

  function resetTodoForm() {
    const TOPIC = "resetForm";

    PubSub.subscribe(TOPIC, () => {
      todoForm.reset();
    });
  }

  function alertTodoNameInvalid() {
    const TOPIC = "todoNameInvalid";

    PubSub.subscribe(TOPIC, (msg, data) => {
      alertNameInvalid(data.form.name, 25);
    });
  }

  function alertTodoNameUnavailable() {
    const TOPIC = "TodoNameUnavailable";

    PubSub.subscribe(TOPIC, (msg, data) => {
      alertNameUnavailable(data.form.name, "Todo");
    });
  }

  function renderTodoOverview() {
    const TOPIC = "todoFound";

    PubSub.subscribe(TOPIC, (msg, data) => {
      blurBackground();
      toggleElementClass(todoOverviewContainer, "active");
      setTextContent(todoOverviewInfoName, data.todo.getName());
      setTextContent(
        todoOverviewInfoDate,
        `Due Date: ${data.todo.getDueDate()}`
      );
      setTextContent(
        todoOverviewInfoPriority,
        `Priority: ${data.todo.getPriority()}`
      );
      setTextContent(todoOverviewInfoList, `List: ${data.listName}`);
      setTextContent(todoOverviewInfoNotes, `Notes: ${data.todo.getNotes()}`);
    });
  }

  function closeTodoOverview() {
    const TOPIC = "todoOverviewCloseBtnClicked";

    PubSub.subscribe(TOPIC, () => {
      blurBackground();
      toggleElementClass(todoOverviewContainer, "active");
    });
  }

  function toggleTodoCompleted() {
    const TOPIC = "todoCheckboxClicked";

    PubSub.subscribe(TOPIC, (msg, event) => {
      const todo = event.target.parentElement.parentElement;
      toggleElementClass(todo, "completed");
    });
  }

  function deleteTodo() {
    const TOPIC = "deleteTodo";

    PubSub.subscribe(TOPIC, (msg, data) => {
      todoContainer.removeChild(data.todoElement);
    });
  }

  function openEditTodoForm() {
    const TOPIC = "todoToBeEditedFound";

    PubSub.subscribe(TOPIC, (msg, data) => {
      todoForm.setAttribute("data-list", data.listName);
      todoForm.setAttribute("data-old-name", data.todoName);
      setTextContent(todoFormTitle, "Edit Todo");
      updateTodoForm(
        data.todo.getName(),
        data.todo.getDueDate(),
        data.todo.getPriority(),
        data.todo.getNotes()
      );
      toggleElementClass(todoFormContainer, "active");
      blurBackground();
    });
  }

  function editTodo() {
    const TOPIC = "todoEdited";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const todos = todoContainer.querySelectorAll(".todo");

      for (let i = 0; i < todos.length; i++) {
        const nameElement = todos[i].querySelector(".todo-name");
        const listName = todos[i].getAttribute("data-list");
        const todoName = nameElement.textContent;

        if (listName === data.listName && todoName === data.oldTodoName) {
          const todo = createTodo(
            data.form.name,
            data.form.dueDate,
            data.listName
          );
          todoContainer.replaceChild(todo, todos[i]);
          const NEW_TOPIC = "resetForm";
          const SECOND_TOPIC = "closeTodoForm";
          PubSub.publish(NEW_TOPIC);
          PubSub.publish(SECOND_TOPIC);
          return;
        }
      }
    });
  }

  // Helper functions
  function updateTodoForm(name, date, priority, notes) {
    todoFormNameInput.value = name;
    todoFormDateInput.value = date;
    todoFormPriorityInput.value = priority;
    todoFormNotesInput.value = notes;
  }

  function setTextContent(element, text) {
    element.textContent = text;
  }

  function updateListViewHeader(text) {
    listViewName.textContent = text;
  }

  function clearTodoContainer() {
    todoContainer.innerHTML = "";
  }

  function clearInput(element) {
    element.value = "";
  }

  function alertNameUnavailable(name, type) {
    alert(`You already have a ${type} named ${name}!`);
  }

  function alertNameEmpty(type) {
    alert(`${type} name cannot be empty!`);
  }

  function alertNameInvalid(name, maxCharacters) {
    alert(
      `${name} is outside of the allowed characters range! (1-${maxCharacters})`
    );
  }

  function blurBackground() {
    toggleElementClass(topBar, "blurred");
    toggleElementClass(contentContainer, "blurred");
  }

  function toggleElementClass(element, className) {
    element.classList.toggle(className);
  }

  return {
    init,
  };
})();

export default DOMHandler;
