import PubSub from "pubsub-js";
import {
  todoFormContainer,
  contentContainer,
  topBar,
  sideBar,
  listsContainer,
  newListNameInput,
  todoContainer,
  todoForm,
  listViewName,
  todoOverviewContainer,
  todoOverviewInfoName,
  todoOverviewInfoDate,
  todoOverviewInfoList,
  todoOverviewInfoNotes,
  todoOverviewInfoPriority,
  todoFormNameInput,
  todoFormDateInput,
  todoFormPriorityInput,
  todoFormNotesInput,
  todoFormTitle,
  listViewIcon,
  openNewTodoFormBtnContainer,
  listViewTodoCounter,
} from "./DOMElements";
import { createList, createTodo } from "./DOMElementCreator";

const DOMHandler = (function () {
  function init() {
    renderHome();
    renderSearchedTodos();
    toggleSidebar();
    alertListNameInvalid();
    alertListNameUnavailable();
    renderSidebarListElement();
    deleteSidebarListElement();
    clearNewListInput();
    renderListView();
    setClickedListAsSelected();
    openNewTodoForm();
    closeTodoForm();
    renderTodo();
    resetTodoForm();
    alertTodoNameInvalid();
    alertTodoNameUnavailable();
    renderTodoOverview();
    closeTodoOverview();
    triggerTodoDeleteAnimation();
    triggerTodoCompleteAnimation();
    deleteTodo();
    openEditTodoForm();
    editTodo();
  }

  function renderHome() {
    const TOPIC = "listsFound";

    PubSub.subscribe(TOPIC, (msg, lists) => {
      clearTodoContainer();
      updateListViewHeader("fas fa-home", "Home");
      toggleElementClass(openNewTodoFormBtnContainer, "disabled");

      lists.forEach((list) => {
        list.getTodos().forEach((todo) => {
          const t = createTodo(
            todo.getName(),
            todo.getDueDate(),
            list.getName()
          );
          todoContainer.appendChild(t);
        });
      });

      updateListViewTodoCounter(todoContainer.children.length);
    });
  }

  function renderSearchedTodos() {
    const TOPIC = "searchedTodosFetched";

    PubSub.subscribe(TOPIC, (msg, data) => {
      clearTodoContainer();
      updateListViewHeader("fas fa-search", "Search");
      addElementClass(openNewTodoFormBtnContainer, "disabled");

      data.forEach((info) => {
        const t = createTodo(
          info.todo.getName(),
          info.todo.getDueDate(),
          info.list
        );
        todoContainer.appendChild(t);
      });

      updateListViewTodoCounter(todoContainer.children.length);
      if (sideBarIsOpen()) {
        const NEW_TOPIC = "toggleSidebar";
        PubSub.publish(NEW_TOPIC);
      }
    });
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

  function renderSidebarListElement() {
    const TOPIC = "renderList";

    PubSub.subscribe(TOPIC, (msg, name) => {
      const list = createList(name);
      listsContainer.appendChild(list);
    });
  }

  function deleteSidebarListElement() {
    const TOPIC = "listDeleted";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const isSelected = data.listElement.classList.contains("selected");
      listsContainer.removeChild(data.listElement);

      if (isSelected) {
        const NEW_TOPIC = "fetchAllLists";
        PubSub.publish(NEW_TOPIC);
      }
    });
  }

  function clearNewListInput() {
    const TOPIC = "listAdded";

    PubSub.subscribe(TOPIC, () => {
      clearInput(newListNameInput);
    });
  }

  function renderListView() {
    const TOPIC = "listFound";

    PubSub.subscribe(TOPIC, (msg, list) => {
      clearTodoContainer();
      updateListViewHeader("fas fa-clipboard-list", list.getName());

      list.getTodos().forEach((todo) => {
        const t = createTodo(todo.getName(), todo.getDueDate(), list.getName());
        todoContainer.appendChild(t);
      });

      updateListViewTodoCounter(todoContainer.children.length);
      removeElementClass(openNewTodoFormBtnContainer, "disabled");

      const NEW_TOPIC = "toggleSidebar";
      PubSub.publish(NEW_TOPIC);
    });
  }

  function setClickedListAsSelected() {
    const TOPIC = "listClicked";

    PubSub.subscribe(TOPIC, (msg, event) => {
      clearPreviousSelectedList();
      const listElement = event.target;
      listElement.classList.add("selected");
    });
  }

  function openNewTodoForm() {
    const TOPIC = "openNewTodoForm";

    PubSub.subscribe(TOPIC, () => {
      setTextContent(todoFormTitle, "New Todo");
      toggleElementClass(todoFormContainer, "active");
      blurBackground();
    });
  }

  function closeTodoForm() {
    const TOPIC = "closeTodoForm";

    PubSub.subscribe(TOPIC, () => {
      toggleElementClass(todoFormContainer, "active");
      blurBackground();
      const NEW_TOPIC = "resetForm";
      PubSub.publish(NEW_TOPIC);
    });
  }

  function renderTodo() {
    const TOPIC = "todoAdded";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const todo = createTodo(data.form.name, data.form.dueDate, data.listName);
      todoContainer.appendChild(todo);
      updateListViewTodoCounter(todoContainer.children.length);

      const NEW_TOPIC = "resetForm";
      const SECOND_TOPIC = "closeTodoForm";
      PubSub.publish(NEW_TOPIC);
      PubSub.publish(SECOND_TOPIC);
    });
  }

  function resetTodoForm() {
    const TOPIC = "resetForm";

    PubSub.subscribe(TOPIC, () => {
      todoForm.reset();
    });
  }

  function alertTodoNameInvalid() {
    const TOPIC = "todoNameInvalid";

    PubSub.subscribe(TOPIC, (msg, data) => {
      alertNameInvalid(data.form.name, 25);
    });
  }

  function alertTodoNameUnavailable() {
    const TOPIC = "TodoNameUnavailable";

    PubSub.subscribe(TOPIC, (msg, data) => {
      alertNameUnavailable(data.form.name, "Todo");
    });
  }

  function renderTodoOverview() {
    const TOPIC = "todoFound";

    PubSub.subscribe(TOPIC, (msg, data) => {
      blurBackground();
      toggleElementClass(todoOverviewContainer, "active");
      setTextContent(todoOverviewInfoName, data.todo.getName());
      setTextContent(
        todoOverviewInfoDate,
        `Due Date: ${data.todo.getDueDate()}`
      );
      setTextContent(
        todoOverviewInfoPriority,
        `Priority: ${data.todo.getPriority()}`
      );
      setTextContent(todoOverviewInfoList, `List: ${data.listName}`);
      setTextContent(todoOverviewInfoNotes, `Notes: ${data.todo.getNotes()}`);
    });
  }

  function closeTodoOverview() {
    const TOPIC = "todoOverviewCloseBtnClicked";

    PubSub.subscribe(TOPIC, () => {
      blurBackground();
      toggleElementClass(todoOverviewContainer, "active");
    });
  }

  function triggerTodoDeleteAnimation() {
    const TOPIC = "deleteTodoBtnClicked";

    PubSub.subscribe(TOPIC, (msg, event) => {
      const todo = event.target.parentElement.parentElement;
      addElementClass(todo, "animate__animated");
      addElementClass(todo, "animate__fadeOutRight");
    });
  }

  function triggerTodoCompleteAnimation() {
    const TOPIC = "todoCheckboxClicked";

    PubSub.subscribe(TOPIC, (msg, event) => {
      const todo = event.target.parentElement.parentElement;
      addElementClass(todo, "animate__animated");
      addElementClass(todo, "animate__hinge");
    });
  }

  function deleteTodo() {
    const TOPIC = "deleteTodo";

    PubSub.subscribe(TOPIC, (msg, data) => {
      todoContainer.removeChild(data.todoElement);
      updateListViewTodoCounter(todoContainer.children.length);
    });
  }

  function openEditTodoForm() {
    const TOPIC = "todoToBeEditedFound";

    PubSub.subscribe(TOPIC, (msg, data) => {
      todoForm.setAttribute("data-list", data.listName);
      todoForm.setAttribute("data-old-name", data.todoName);
      setTextContent(todoFormTitle, "Edit Todo");
      updateTodoForm(
        data.todo.getName(),
        data.todo.getDueDate(),
        data.todo.getPriority(),
        data.todo.getNotes()
      );
      toggleElementClass(todoFormContainer, "active");
      blurBackground();
    });
  }

  function editTodo() {
    const TOPIC = "todoEdited";

    PubSub.subscribe(TOPIC, (msg, data) => {
      const todos = todoContainer.querySelectorAll(".todo");

      for (let i = 0; i < todos.length; i++) {
        const nameElement = todos[i].querySelector(".todo-name");
        const listName = todos[i].getAttribute("data-list");
        const todoName = nameElement.textContent;

        if (listName === data.listName && todoName === data.oldTodoName) {
          const todo = createTodo(
            data.form.name,
            data.form.dueDate,
            data.listName
          );
          todoContainer.replaceChild(todo, todos[i]);
          const NEW_TOPIC = "resetForm";
          const SECOND_TOPIC = "closeTodoForm";
          PubSub.publish(NEW_TOPIC);
          PubSub.publish(SECOND_TOPIC);
        }
      }
    });
  }

  // Helper functions
  function sideBarIsOpen() {
    return sideBar.classList.contains("active");
  }

  function updateListViewTodoCounter(number) {
    if (number === 1) {
      listViewTodoCounter.textContent = `${number} Todo`;
      return;
    }

    listViewTodoCounter.textContent = `${number} Todos`;
  }

  function clearPreviousSelectedList() {
    const lists = listsContainer.querySelectorAll(".list");

    for (let i = 0; i < lists.length; i++) {
      if (lists[i].classList.contains("selected")) {
        toggleElementClass(lists[i], "selected");
        return;
      }
    }
  }

  function updateTodoForm(name, date, priority, notes) {
    todoFormNameInput.value = name;
    todoFormDateInput.value = date;
    todoFormPriorityInput.value = priority;
    todoFormNotesInput.value = notes;
  }

  function setTextContent(element, text) {
    element.textContent = text;
  }

  function updateListViewHeader(iconClass, text) {
    listViewIcon.className = iconClass;
    listViewName.textContent = text;
  }

  function clearTodoContainer() {
    todoContainer.innerHTML = "";
  }

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

  function removeElementClass(element, className) {
    element.classList.remove(className);
  }

  function addElementClass(element, className) {
    element.classList.add(className);
  }

  return {
    init,
  };
})();

export default DOMHandler;
