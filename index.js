const todoListUl = document.querySelector('.todo__items')
const newTodoInput = document.querySelector(".header__new-todo")
const clearBtn = document.querySelector('.footer__button')
const toggleAllBtn = document.querySelector('.todo__toggle-all')
const footerCountBlock = document.querySelector('.footer__count')

const filterAllBtn = document.querySelector('.filter-all')
const filterActiveBtn = document.querySelector('.filter-active')
const filterCompletedBtn = document.querySelector('.filter-completed')

const url = window.location.href
const activeString = '#/active'
const completedString = '#/completed'

let completedCount = 0
let notCompletedCount = 0

const getTodosLS = () => {
  return localStorage.getItem('todos')
}

const setTodosLS = () => {
  localStorage.setItem('todos', JSON.stringify(todoList))
}

const createTodoNode = (title, id, completed) => {
  // в ли добавляется класс completed если завершен или editing если меняется текст у тудушки
  const html = `
      <div class="todo__item">
        <input class="todo__toggle" type="checkbox" ${completed ? "checked" : ""}>
        <label class="todo__text">${title}</label>
        <button class="todo__remove"></button>
      </div>
      <input type="text" class="todo__edit"></input>`

  const todoNode = document.createElement('li')
  todoNode.setAttribute('id', id)
  if (completed) {
    todoNode.classList.add('completed')
  }

  todoNode.innerHTML = html
  return todoNode
}

const addEventListenersToCheckbox = (listItemCheckbox, todoNode, id) => {
  listItemCheckbox.addEventListener('click', (e) => {
    let check = e.target.checked
    setCheckedTodo(id)
    listItemCheckbox.checked = check

    if (check && !todoNode.classList.contains('completed')) {
      // поставить галочку
      todoNode.classList.add('completed')
      completedCount += 1
      notCompletedCount -= 1
      setCompletedBlockVisible()
      setCountNotCompletedTodos()
    }

    if (!check && todoNode.classList.contains('completed')) {
      // удалить галочку
      todoNode.classList.remove('completed')

      completedCount -= 1
      notCompletedCount += 1
      setCompletedBlockVisible()
      setCountNotCompletedTodos()
    }
  })
}

const addEventListenersToLabel = (listItemLabel, todoNode, editInput) => {
  listItemLabel.addEventListener('dblclick', () => {
    todoNode.classList.add('editing')
    editInput.value = listItemLabel.innerText
    editInput.focus()
  })
}

const addEventListenersToButton = (buttonItem, id) => {
  buttonItem.addEventListener('click', () => removeTodo(id))
}

const addEventListenersToEdit = (editInput, listItemLabel, todoNode, id) => {
  const changeHandler = () => {
    const title = editInput.value
    todoNode.classList.remove('editing')
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
}

const addEventListenersToNode = (todoNode, id) => {
  const editInput = todoNode.children[1]

  const listItemCheckbox = todoNode.children[0].children[0]
  const listItemLabel = todoNode.children[0].children[1]
  const buttonItem = todoNode.children[0].children[2]

  addEventListenersToCheckbox(listItemCheckbox, todoNode, id)
  addEventListenersToLabel(listItemLabel, todoNode, editInput)
  addEventListenersToButton(buttonItem, id)

  addEventListenersToEdit(editInput, listItemLabel, todoNode, id)
}

const addTodoToUL = (title, id, completed = false) => {
  const newTodoNode = createTodoNode(title, id, completed)
  addEventListenersToNode(newTodoNode, id)
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

  notCompletedCount += 1
  setCountNotCompletedTodos()
}

const removeTodo = (id) => {
  const todoCompleted = todoList.find(x => x.id === id).completed

  const newArray = todoList.filter(todo => todo.id.toString() !== id.toString())
  todoList = newArray

  todoListUl.innerHTML = ""
  // можно не учитывать удаленный узел, в инициалайз их количество обнуляется и пересчитывается
  initializeTodos(todoList)
  setTodosLS()
}

const initializeTodos = () => {
  todoListUl.innerHTML = ''

  completedCount = 0

  todoList.forEach(item => {
    addTodoToUL(item.title, item.id, item.completed)

    if (item.completed) {
      completedCount += 1
    }
  })

  notCompletedCount = todoList.length - completedCount

  setCompletedBlockVisible()
  setCountNotCompletedTodos()
}

// изменить текст таска
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

// тут скорее даже не сет, а тоггл но ладно уж
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

const toggleAllTodos = () => {
  const len = todoList.length
  let localCompletedCount = 0

  const allIdsList = []
  const notCheckedIdsList = []

  todoList.forEach(item => {
    allIdsList.push(item.id)

    if (item.completed === true) {
      localCompletedCount += 1
    } else {
      notCheckedIdsList.push(item.id)
    }
  })

  // все тудушки выполнены надо отменить их
  if (localCompletedCount === len) {
    allIdsList.forEach(id => setCheckedTodo(id))
  } else {
    // есть тудушки, которые выполнены и те, которым нужно установить checked тру
    notCheckedIdsList.forEach(id => setCheckedTodo(id))
  }

  initializeTodos()
}

// отображение количества оставшихся тасков
const setCompletedBlockVisible = () => {
  if (completedCount > 0 && clearBtn.classList.contains('hide')) {
    clearBtn.classList.remove('hide')
  }
  if (completedCount === 0 && !clearBtn.classList.contains('hide')) {
    clearBtn.classList.add('hide')
  }
}

const setCountNotCompletedTodos = () => {
  const firstPart = notCompletedCount.toString()
  let secondPart = ''

  if (notCompletedCount === 1) {
    secondPart = ' item left'
  } else {
    secondPart = ' items left'
  }

  footerCountBlock.innerHTML = firstPart + secondPart
}

// i = all || active || completed
const setFilterSelected = (filter) => {
  // если добавить ещё один фильтр, то расширить будет трудновато, но вряд ли его ведь добавят))
  const all = filterAllBtn.children[0]
  const active = filterActiveBtn.children[0]
  const comp = filterCompletedBtn.children[0]

  const cn = 'selected'
  switch (filter) {
    case 'all':
      if (!all.classList.contains(cn)) {
        if (active.classList.contains(cn)) {
          active.classList.remove(cn)
        } else {
          comp.classList.remove(cn)
        }

        all.classList.add(cn)
      }
      break;
    case 'active':
      if (!active.classList.contains(cn)) {
        if (all.classList.contains(cn)) {
          all.classList.remove(cn)
        } else {
          comp.classList.remove(cn)
        }
        active.classList.add(cn)
      }
      break;
    case 'completed':
      if (!comp.classList.contains(cn)) {
        if (active.classList.contains(cn)) {
          active.classList.remove(cn)
        } else {
          all.classList.remove(cn)
        }

        comp.classList.add(cn)
      }
      break;

    default:
      break;
  }
  console.log('Ошибка в setFilterSelected, передано некорректное значение. Принимаются только all, active и completed')
}

// обработчики нижних трех кнопок в футере
// на вход all, active, something
const showSmth = (filter) => {
  const children = todoListUl.children;
  for (let i = 0; i < children.length; i++) {
    const currentChild = children[i]
    switch (filter) {
      case "all":
        if (currentChild.classList.contains('hide')) {
          currentChild.classList.remove('hide')
        }
        break;
      case "active":
        if (currentChild.classList.contains('completed')) {
          currentChild.classList.add('hide')
        } else if (currentChild.classList.contains('hide')) {
          currentChild.classList.remove('hide')
        }
        break;

      case "completed":
        if (!currentChild.classList.contains('completed')) {
          currentChild.classList.add('hide')
        } else if (currentChild.classList.contains('hide')) {
          currentChild.classList.remove('hide')
        }
        break;

      default:
        break;
    }
  }
  setFilterSelected(filter)
}

// удаление всех отмеченных тасков
const clearCompleted = () => {
  const newArray = todoList.filter(todo => todo.completed !== true)
  todoList = newArray

  todoListUl.innerHTML = ""
  initializeTodos(todoList)
  setTodosLS()
}



const addEventListeners = () => {
  filterAllBtn.addEventListener('click', () => showSmth('all'))
  filterActiveBtn.addEventListener('click', () => showSmth('active'))
  filterCompletedBtn.addEventListener('click', () => showSmth('completed'))

  clearBtn.addEventListener("click", () => clearCompleted())
  toggleAllBtn.addEventListener("click", () => toggleAllTodos())

  newTodoInput.addEventListener('focusout', () => createTodo())
  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      createTodo()
    }
  })
}

let todoList = JSON.parse(getTodosLS()) || []

const initializeApp = () => {
  addEventListeners()

  initializeTodos()

  if (url.includes(activeString)) {
    showActive()
  } else if (url.includes(completedString)) {
    showCompleted()
  }
}

initializeApp()