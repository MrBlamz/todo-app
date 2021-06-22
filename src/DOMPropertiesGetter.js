import PubSub from "pubsub-js";
import { newListNameInput } from "./DOMElements";

const DOMPropertiesGetter = (function () {
  function init() {
    getNewListName();
  }

  function getNewListName() {
    const TOPIC = "newListNameInputted";

    PubSub.subscribe(TOPIC, () => {
      const ListName = newListNameInput.value;
      const NEW_TOPIC = "validateListName";

      PubSub.publish(NEW_TOPIC, ListName);
    });
  }

  return {
    init,
  };
})();

export default DOMPropertiesGetter;
