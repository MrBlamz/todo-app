import PubSub from "pubsub-js";
import List from "./List";

const ListManager = (function () {
  const _lists = [];

  function init() {
    addList();
  }

  function addList() {
    const TOPIC = "listNameValid";

    PubSub.subscribe(TOPIC, (msg, name) => {
      const capitalized = capitalize(name);
      const available = nameIsAvailable(capitalized);
      let NEW_TOPIC;

      if (available) {
        _lists.push(List(capitalized));
        NEW_TOPIC = "listAdded";
      } else {
        NEW_TOPIC = "listNameUnavailable";
      }

      PubSub.publish(NEW_TOPIC, capitalized);
    });
  }

  // Helper functions
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function nameIsAvailable(name) {
    let available = true;

    for (let i = 0; i < _lists.length; i++) {
      if (_lists[i].getName() === name) {
        available = false;
        break;
      }
    }

    return available;
  }

  return {
    init,
  };
})();

export default ListManager;
