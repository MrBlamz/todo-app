import PubSub from "pubsub-js";
import List from "./List";

const ListManager = (function () {
  const _lists = [];

  function init() {
    addList();
    deleteList();
    fetchList();
    addTodoToList();
    fetchTodo();
    deleteTodoFromList();
    getTodoToBeEdited();
    editTodo();
    fetchAllLists();
    fetchSearchedTodos();
  }

  function addList() {
    const TOPIC = "listNameValid";

    PubSub.subscribe(TOPIC, (msg, name) => {
      const capitalizedListName = capitalizeFirstLetter(name);
      const available = nameIsAvailable(capitalizedListName);
      let NEW_TOPIC;

      if (available) {
        _lists.push(List(capitalizedListName));
        NEW_TOPIC = "listAdded";
      } else {
        NEW_TOPIC = "listNameUnavailable";
      }

      PubSub.publish(NEW_TOPIC, capitalizedListName);
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
    const TOPIC = "newTodoNameValid";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const listName = data.listName;
      const list = getList(listName);
      data.form.name = capitalizeFirstLetter(data.form.name);
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

  function fetchTodo() {
    const TOPIC = "fetchTodo";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const list = getList(data.listName);
      const todo = list.getTodo(data.todoName);
      data.todo = todo;

      const NEW_TOPIC = "todoFound";
      PubSub.publish(NEW_TOPIC, data);
    });
  }

  function deleteTodoFromList() {
    const TOPIC = "deleteTodo";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const list = getList(data.listName);
      list.deleteTodo(data.todoName);
    });
  }

  function getTodoToBeEdited() {
    const TOPIC = "getTodoInfoToBeEdited";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const list = getList(data.listName);
      data.todo = list.getTodo(data.todoName);
      const NEW_TOPIC = "todoToBeEditedFound";
      PubSub.publish(NEW_TOPIC, data);
    });
  }

  function editTodo() {
    const TOPIC = "editedNameValid";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const listName = data.listName;
      const list = getList(listName);
      data.form.name = capitalizeFirstLetter(data.form.name);
      const isUnavailable =
        list.contains(data.form.name) && data.form.name !== data.oldTodoName;
      let NEW_TOPIC;

      if (isUnavailable) {
        NEW_TOPIC = "TodoNameUnavailable";
      } else {
        const todo = list.getTodo(data.oldTodoName);
        todo.setName(data.form.name);
        todo.setDueDate(data.form.dueDate);
        todo.setPriority(data.form.priority);
        todo.setNotes(data.form.notes);
        NEW_TOPIC = "todoEdited";
      }

      PubSub.publish(NEW_TOPIC, data);
    });
  }

  function fetchAllLists() {
    const TOPIC = "fetchAllLists";

    PubSub.subscribe(TOPIC, () => {
      const lists = _lists;
      const NEW_TOPIC = "listsFound";
      PubSub.publish(NEW_TOPIC, lists);
    });
  }

  function fetchSearchedTodos() {
    const TOPIC = "fetchSearchedTodos";

    PubSub.subscribe(TOPIC, (msg, todoName) => {
      const data = [];

      _lists.forEach((list) => {
        const info = {};
        const capitalizedTodoName = capitalizeFirstLetter(todoName);

        if (list.contains(capitalizedTodoName)) {
          info.todo = list.getTodo(capitalizedTodoName);
          info.list = list.getName();
          data.push(info);
        }
      });

      const NEW_TOPIC = "searchedTodosFetched";
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

  function capitalizeFirstLetter(string) {
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
