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

  return {
    addTodo,
    getName,
    getTodos,
  };
};

export default List;
