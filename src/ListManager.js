import PubSub from "pubsub-js";
import List from "./List";

const ListManager = (function () {
  const _lists = [];

  function init() {
    addList();
    deleteList();
    fetchList();
    addTodoToList();
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

  function deleteList() {
    const TOPIC = "deleteList";

    PubSub.subscribe(TOPIC, (msg, data) => {
      for (let i = 0; i < _lists.length; i++) {
        if (_lists[i].getName() === data.listName) {
          _lists.splice(i, 1);
          const NEW_TOPIC = "listDeleted";
          PubSub.publish(NEW_TOPIC, data);
          break;
        }
      }
    });
  }

  function fetchList() {
    const TOPIC = "fetchList";

    PubSub.subscribe(TOPIC, (msg, listName) => {
      const list = getList(listName);
      const NEW_TOPIC = "listFound";
      PubSub.publish(NEW_TOPIC, list);
    });
  }

  function addTodoToList() {
    const TOPIC = "addTodo";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const listName = data.listName;
      const list = getList(listName);
      const isUnavailable = list.contains(data.form.name);
      let NEW_TOPIC;

      if (isUnavailable) {
        NEW_TOPIC = "TodoNameUnavailable";
      } else {
        list.addTodo(
          data.form.name,
          data.form.dueDate,
          data.form.priority,
          data.form.notes
        );
        NEW_TOPIC = "todoAdded";
      }

      PubSub.publish(NEW_TOPIC, data);
    });
  }

  // Helper functions
  function getList(name) {
    for (let i = 0; i < _lists.length; i++) {
      if (_lists[i].getName() === name) {
        return _lists[i];
      }
    }
  }

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
