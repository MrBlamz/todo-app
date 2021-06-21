import PubSub from "pubsub-js";
import {
  openNewTodoFormBtn,
  todoFormCloseBtn,
  toggleSidebarBtn,
} from "./DOMElements";

const EventListener = (function () {
  function init() {
    toggleSidebarBtnClicked();
    openNewTodoFormBtnClicked();
    todoFormCloseBtnClicked();
  }

  function toggleSidebarBtnClicked() {
    const TOPIC = "toggleSidebar";

    toggleSidebarBtn.addEventListener("click", () => {
      PubSub.publish(TOPIC);
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

  return {
    init,
  };
})();

export default EventListener;
