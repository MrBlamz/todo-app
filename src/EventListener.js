import PubSub from "pubsub-js";
import {
  openNewTodoFormBtn,
  todoFormCloseBtn,
  toggleSidebarBtn,
  addListInputContainer,
  addListBtn,
  listsContainer,
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
