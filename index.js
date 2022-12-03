const todoListUl = document.querySelector('.todo__items')
const btnAdd = document.querySelector(".add-todo")
const newTodoInput = document.querySelector(".header__new-todo")
const clearBtn = document.querySelector('.footer__button')
const toggleAllBtn = document.querySelector('.todo__toggle-all')

const getTodosLS = () => {
  return localStorage.getItem('todos')
}

const setTodosLS = () => {
  localStorage.setItem('todos', JSON.stringify(todoList))
}

const createTodoNode = (title, id, completed) => {
  // вид туду айтема: в ли добавляется класс completed если завеоешн или editing если меняется текст у тудушки
  // <li class="" data-id="1">
  //   <div class="todo__item">
  //     <input class="todo__toggle" type="checkbox">
  //     <label class="todo__text"> Певрое задание</label>
  //     <button class="todo__remove"></button>
  //   </div>
  //    <input type="text" class="todo__edit"></input>
  //  </li>

  const listItem = document.createElement("li")
  const blockItem = document.createElement("div")
  const listItemCheckbox = document.createElement("input")
  const listItemLabel = document.createElement("label")
  const buttonItem = document.createElement("button")
  const editInput = document.createElement("input")

  const todoNode = document.createDocumentFragment()

  listItem.setAttribute('id', id)
  completed && listItem.classList.add('completed')

  blockItem.classList.add('todo__item')

  listItemCheckbox.type = 'checkbox'
  listItemCheckbox.classList.add('todo__toggle')
  if (completed) {
    listItemCheckbox.checked = true
  }
  listItemCheckbox.addEventListener('click', (e) => {
    let check = e.target.checked
    setCheckedTodo(id)
    listItemCheckbox.checked = check

    if (check && !listItem.classList.contains('completed')) {
      listItem.classList.add('completed')
    }
    if (!check && listItem.classList.contains('completed')) {
      listItem.classList.remove('completed')
    }
  })

  listItemLabel.classList.add('todo__text')
  listItemLabel.addEventListener('dblclick', () => {
    listItem.classList.add('editing')
    editInput.value = listItemLabel.innerText
    editInput.focus()
  })

  listItemLabel.innerHTML = title

  buttonItem.classList.add('todo__remove')
  buttonItem.addEventListener('click', () => removeTodo(id))

  editInput.classList.add('todo__edit')


  const changeHandler = () => {
    const title = editInput.value
    listItem.classList.remove('editing')
    listItemLabel.innerText = title
    setTitleTodo(title, id)
  }

  editInput.addEventListener('focusout', () => changeHandler())

  editInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      changeHandler()
    }
  })


  listItem.append(blockItem, editInput)
  blockItem.append(listItemCheckbox, listItemLabel, buttonItem)

  todoNode.append(listItem)

  return todoNode
}

const addTodoToUL = (title, id, completed = false) => {
  const newTodoNode = createTodoNode(title, id, completed)
  todoListUl.appendChild(newTodoNode)
}

const createTodo = () => {
  const title = newTodoInput.value

  if (title === "") {
    return
  }

  const id = Date.now().toString()
  newTodoInput.value = ""

  addTodoToUL(title, id)
  todoList.push({ title, id, completed: false })
  setTodosLS()
}

const removeTodo = (id) => {
  const newArray = todoList.filter(todo => todo.id.toString() !== id.toString())
  todoList = newArray

  todoListUl.innerHTML = ""
  initializeTodos(todoList)
  setTodosLS()
}

const setCheckedTodo = (id) => {
  const newArray = todoList.map((todo) => {
    if (todo.id.toString() === id.toString()) {
      todo.completed = !todo.completed
    }
    return todo
  })

  todoList = newArray
  setTodosLS()
}

const initializeTodos = () => {
  todoListUl.innerHTML = ''
  todoList.forEach(item => {
    addTodoToUL(item.title, item.id, item.completed)
  })
}

const clearCompleted = () => {
  const newArray = todoList.filter(todo => todo.completed !== true)
  todoList = newArray

  todoListUl.innerHTML = ""
  initializeTodos(todoList)
  setTodosLS()
}

const setTitleTodo = (title, id) => {
  const newArray = todoList.map((todo) => {
    if (todo.id.toString() === id.toString()) {
      todo.title = title
    }
    return todo
  })

  todoList = newArray
  setTodosLS()
}

const toggleAllTodos = () => {
  const len = todoList.length
  let completedCount = 0
  const allIdsList = []
  const notCheckedIdsList = []

  todoList.forEach(item => {
    allIdsList.push(item.id)

    if (item.completed === true) {
      completedCount += 1
    } else {
      notCheckedIdsList.push(item.id)
    }
  })

  // все тудушки выполнены надо отменить их
  if (completedCount === len) {
    allIdsList.forEach(id => setCheckedTodo(id))
  } else {
    // есть тудушки, которые выполнены и те, которым нужно установить checked тру
    notCheckedIdsList.forEach(id => setCheckedTodo(id))
  }

  initializeTodos()
}


let todoList = JSON.parse(getTodosLS())

btnAdd.addEventListener("click", () => createTodo())
clearBtn.addEventListener("click", () => clearCompleted())
toggleAllBtn.addEventListener("click", () => toggleAllTodos())

initializeTodos()
console.log(todoListUl.children)


