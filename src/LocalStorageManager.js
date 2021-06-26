import PubSub from "pubsub-js";

const LocalStorageManager = (function () {
  function init() {
    fetchLists();
    storeNewList();
    removeList();
    updateList();
  }

  function fetchLists() {
    const TOPIC = "fetchListsFromLocalStorage";

    PubSub.subscribe(TOPIC, () => {
      const keys = Object.keys(localStorage);

      for (let i = 0; i < keys.length; i++) {
        try {
          let listName = keys[i];
          const todos = JSON.parse(localStorage.getItem(listName));
          const NEW_TOPIC = "fetchedListFromLocalStorage";
          PubSub.publish(NEW_TOPIC, { listName, todos });
        } catch (error) {
          continue;
        }
      }
    });
  }

  function storeNewList() {
    const TOPIC = "listAdded";

    PubSub.subscribe(TOPIC, (msg, listName) => {
      localStorage.setItem(listName, JSON.stringify([]));
    });
  }

  function removeList() {
    const TOPIC = "listDeleted";

    PubSub.subscribe(TOPIC, (msg, data) => {
      localStorage.removeItem(data.listName);
    });
  }

  function updateList() {
    const FIRST_TOPIC = "todoAdded";
    const SECOND_TOPIC = "deleteTodo";
    const THIRD_TOPIC = "todoEdited";

    PubSub.subscribe(FIRST_TOPIC, (msg, data) => {
      const list = JSON.parse(localStorage.getItem(data.listName));
      const todo = {
        name: data.form.name,
        dueDate: data.form.dueDate,
        priority: data.form.priority,
        notes: data.form.notes,
      };
      list.push(todo);
      localStorage.setItem(data.listName, JSON.stringify(list));
    });

    PubSub.subscribe(SECOND_TOPIC, (msg, data) => {
      let list = JSON.parse(localStorage.getItem(data.listName));
      list = list.filter((todo) => todo.name !== data.todoName);
      localStorage.setItem(data.listName, JSON.stringify(list));
    });

    PubSub.subscribe(THIRD_TOPIC, (msg, data) => {
      const list = JSON.parse(localStorage.getItem(data.listName));

      for (let i = 0; i < list.length; i++) {
        const todo = list[i];
        if (todo.name === data.oldTodoName) {
          todo.name = data.form.name;
          todo.dueDate = data.form.dueDate;
          todo.priority = data.form.priority;
          todo.notes = data.form.notes;
          break;
        }
      }

      localStorage.setItem(data.listName, JSON.stringify(list));
    });
  }

  return {
    init,
  };
})();

export default LocalStorageManager;
