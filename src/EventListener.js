import PubSub from "pubsub-js";
import {
  openNewTodoFormBtn,
  todoFormCloseBtn,
  toggleSidebarBtn,
  addListInputContainer,
  addListBtn,
  listsContainer,
  todoContainer,
  todoOverviewCloseBtn,
} from "./DOMElements";

const EventListener = (function () {
  function init() {
    // Sidebar
    toggleSidebarBtnClicked();
    newListNameInputted();
    deleteListBtnClicked();
    listClicked();
    // List View
    openNewTodoFormBtnClicked();
    todoFormCloseBtnClicked();
    todoFormSubmitBtnClicked();
    todoClicked();
    todoOverviewCloseBtnClicked();
    todoCheckboxClicked();
  }

  function toggleSidebarBtnClicked() {
    const TOPIC = "toggleSidebar";

    toggleSidebarBtn.addEventListener("click", () => {
      PubSub.publish(TOPIC);
    });
  }

  function newListNameInputted() {
    const TOPIC = "newListNameInputted";

    addListBtn.addEventListener("click", () => {
      PubSub.publish(TOPIC);
    });

    addListInputContainer.addEventListener("keydown", (event) => {
      const isInput = isDesiredElement(event.target, "add-list-input");
      const isKey = isDesiredKey(event.key, "Enter");

      if (isInput && isKey) {
        PubSub.publish(TOPIC);
      }
    });
  }

  function deleteListBtnClicked() {
    const TOPIC = "deleteListBtnClicked";

    listsContainer.addEventListener("click", (event) => {
      const isButton = isDesiredElement(event.target, "delete-list-btn");

      if (isButton) {
        PubSub.publish(TOPIC, event);
      }
    });
  }

  function listClicked() {
    const TOPIC = "listClicked";

    listsContainer.addEventListener("click", (event) => {
      const isList = isDesiredElement(event.target, "list");

      if (isList) {
        PubSub.publish(TOPIC, event);
      }
    });
  }

  function openNewTodoFormBtnClicked() {
    const TOPIC = "openNewTodoForm";

    openNewTodoFormBtn.addEventListener("click", () => {
      PubSub.publish(TOPIC);
    });
  }

  function todoFormCloseBtnClicked() {
    const TOPIC = "closeTodoForm";

    todoFormCloseBtn.addEventListener("click", () => {
      PubSub.publish(TOPIC);
    });
  }

  function todoFormSubmitBtnClicked() {
    const TOPIC = "todoFormSubmitBtnClicked";

    window.addEventListener("submit", (event) => {
      const isSubmitFormButton = isDesiredElement(
        event.submitter,
        "todo-form-submit-btn"
      );

      if (isSubmitFormButton) {
        event.preventDefault();
        PubSub.publish(TOPIC);
      }
    });
  }

  function todoClicked() {
    const TOPIC = "todoClicked";

    todoContainer.addEventListener("click", (event) => {
      const isTodo = isDesiredElement(event.target, "todo");

      if (isTodo) {
        PubSub.publish(TOPIC, event);
      }
    });
  }

  function todoOverviewCloseBtnClicked() {
    const TOPIC = "todoOverviewCloseBtnClicked";

    todoOverviewCloseBtn.addEventListener("click", () => {
      PubSub.publish(TOPIC);
    });
  }

  function todoCheckboxClicked() {
    const TOPIC = "todoCheckboxClicked";

    todoContainer.addEventListener("click", (event) => {
      const isCheckbox = isDesiredElement(
        event.target,
        "todo-completed-checkbox"
      );

      if (isCheckbox) {
        PubSub.publish(TOPIC, event);
      }
    });
  }

  // Helper functions
  function isDesiredElement(element, string) {
    return element.classList.contains(string);
  }

  function isDesiredKey(pressedKey, targetKey) {
    return pressedKey === targetKey;
  }

  return {
    init,
  };
})();

export default EventListener;
