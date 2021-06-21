import PubSub from "pubsub-js";
import { todoFormContainer, contentContainer, topBar } from "./DOMElements";

const DOMHandler = (function () {
  function init() {
    openNewTodoForm();
    closeTodoForm();
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
