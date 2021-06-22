import PubSub from "pubsub-js";
import {
  openNewTodoFormBtn,
  todoFormCloseBtn,
  toggleSidebarBtn,
  addListInputContainer,
  addListBtn,
} from "./DOMElements";

const EventListener = (function () {
  function init() {
    toggleSidebarBtnClicked();
    newListNameInputted();
    openNewTodoFormBtnClicked();
    todoFormCloseBtnClicked();
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
      const isElement = isDesiredElement(event.target, "add-list-input");
      const isKey = isDesiredKey(event.key, "Enter");

      if (isElement && isKey) {
        PubSub.publish(TOPIC);
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
