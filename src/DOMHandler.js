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
} from "./DOMElements";
import { createList, createTodo } from "./DOMElementCreator";

const DOMHandler = (function () {
  function init() {
    toggleSidebar();
    alertListNameInvalid();
    alertListNameUnavailable();
    addListToSidebar();
    deleteListFromSidebar();
    clearNewListInput();
    renderList();
    openNewTodoForm();
    closeTodoForm();
    renderTodo();
    resetTodoForm();
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

  function addListToSidebar() {
    const TOPIC = "listAdded";

    PubSub.subscribe(TOPIC, (msg, name) => {
      const list = createList(name);
      listsContainer.appendChild(list);
    });
  }

  function deleteListFromSidebar() {
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
        const t = createTodo(todo.getName(), todo.getDueDate());
        todoContainer.appendChild(t);
      });
    });
  }

  function openNewTodoForm() {
    const TOPIC = "openNewTodoForm";

    PubSub.subscribe(TOPIC, () => {
      toggleElementClass(todoFormContainer, "active");
      blurBackground();
    });
  }

  function closeTodoForm() {
    const TOPIC = "closeTodoForm";

    PubSub.subscribe(TOPIC, () => {
      toggleElementClass(todoFormContainer, "active");
      blurBackground();
    });
  }

  function renderTodo() {
    const TOPIC = "todoAdded";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const todo = createTodo(data.form.name, data.form.dueDate);
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

  // Helper functions
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
