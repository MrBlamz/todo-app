import PubSub from "pubsub-js";
import { newListNameInput } from "./DOMElements";

const DOMPropertiesGetter = (function () {
  function init() {
    getNewListName();
    getDeletedListName();
    getClickedListName();
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
      const NEW_TOPIC = "getList";
      PubSub.publish(NEW_TOPIC, listName);
    });
  }

  return {
    init,
  };
})();

export default DOMPropertiesGetter;
