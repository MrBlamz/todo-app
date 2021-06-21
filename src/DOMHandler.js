import PubSub from "pubsub-js";
import {
  todoFormContainer,
  contentContainer,
  topBar,
  sideBar,
} from "./DOMElements";

const DOMHandler = (function () {
  function init() {
    toggleSidebar();
    openNewTodoForm();
    closeTodoForm();
  }

  function toggleSidebar() {
    const TOPIC = "toggleSidebar";

    PubSub.subscribe(TOPIC, () => {
      toggleElementClass(sideBar, "active");
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

  // Helper functions
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
