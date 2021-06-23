import Todo from "./Todo";

const List = function (name) {
  const _name = name;
  const _todos = [];

  function addTodo(name, dueDate, priority, notes) {
    _todos.push(Todo(name, dueDate, priority, notes));
  }

  function getName() {
    return _name;
  }

  function getTodos() {
    return _todos;
  }

  function contains(name) {
    const result = _todos.filter((todo) => todo.getName() === name);
    return result.length === 0 ? false : true;
  }

  return {
    addTodo,
    getName,
    getTodos,
    contains,
  };
};

export default List;
