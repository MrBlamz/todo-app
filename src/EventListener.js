import PubSub from "pubsub-js";
import { openNewTodoFormBtn, todoFormCloseBtn } from "./DOMElements";

const EventListener = (function () {
  function init() {
    openNewTodoFormBtnClicked();
    todoFormCloseBtnClicked();
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
