import PubSub from "pubsub-js";
import {
  listViewName,
  newListNameInput,
  todoFormDateInput,
  todoFormNameInput,
  todoFormNotesInput,
  todoFormPriorityInput,
} from "./DOMElements";

const DOMPropertiesGetter = (function () {
  function init() {
    getNewListName();
    getDeletedListName();
    getClickedListName();
    getTodoFormValue();
    getClickedTodoName();
    getDeletedTodoName();
  }

  function getNewListName() {
    const TOPIC = "newListNameInputted";

    PubSub.subscribe(TOPIC, () => {
      const ListName = newListNameInput.value;
      const NEW_TOPIC = "validateListName";

      PubSub.publish(NEW_TOPIC, ListName);
    });
  }

  function getDeletedListName() {
    const TOPIC = "deleteListBtnClicked";

    PubSub.subscribe(TOPIC, (msg, event) => {
      const listName = event.target.previousSibling.textContent;
      const listElement = event.target.parentElement;
      const NEW_TOPIC = "deleteList";
      PubSub.publish(NEW_TOPIC, { listName, listElement });
    });
  }

  function getClickedListName() {
    const TOPIC = "listClicked";

    PubSub.subscribe(TOPIC, (msg, event) => {
      const listName = event.target.textContent;
      const NEW_TOPIC = "fetchList";
      PubSub.publish(NEW_TOPIC, listName);
    });
  }

  function getTodoFormValue() {
    const TOPIC = "todoFormSubmitBtnClicked";

    PubSub.subscribe(TOPIC, () => {
      const listName = listViewName.textContent;
      const form = {
        name: todoFormNameInput.value,
        dueDate: todoFormDateInput.value,
        priority: todoFormPriorityInput.value,
        notes: todoFormNotesInput.value,
      };

      const NEW_TOPIC = "validateTodoName";
      PubSub.publish(NEW_TOPIC, { listName, form });
    });
  }

  function getClickedTodoName() {
    const TOPIC = "todoClicked";

    PubSub.subscribe(TOPIC, (msg, event) => {
      const listName = event.target.getAttribute("data-list");
      const todoName = event.target.querySelector(".todo-name").textContent;
      const NEW_TOPIC = "fetchTodo";
      PubSub.publish(NEW_TOPIC, { listName, todoName });
    });
  }

  function getDeletedTodoName() {
    const TOPIC = "deleteTodoBtnClicked";

    PubSub.subscribe(TOPIC, (msg, event) => {
      const todoElement = event.target.parentElement.parentElement;
      const listName = todoElement.getAttribute("data-list");
      const todoName = todoElement.querySelector(".todo-name").textContent;
      const NEW_TOPIC = "deleteTodo";
      PubSub.publish(NEW_TOPIC, { todoElement, listName, todoName });
    });
  }

  return {
    init,
  };
})();

export default DOMPropertiesGetter;
