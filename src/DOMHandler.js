import PubSub from "pubsub-js";
import {
  todoFormContainer,
  contentContainer,
  topBar,
  sideBar,
  listsContainer,
  newListNameInput,
} from "./DOMElements";
import { createList } from "./DOMElementCreator";

const DOMHandler = (function () {
  function init() {
    toggleSidebar();
    alertListNameInvalid();
    alertListNameUnavailable();
    addListToSidebar();
    clearNewListInput();
    openNewTodoForm();
    closeTodoForm();
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

  function clearNewListInput() {
    const TOPIC = "listAdded";

    PubSub.subscribe(TOPIC, () => {
      clearInput(newListNameInput);
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
