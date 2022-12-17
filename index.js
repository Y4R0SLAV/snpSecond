const todoListUl = document.querySelector('.todo__items')

const newTodoInput = document.querySelector(".header__new-todo")
const clearBtn = document.querySelector('.footer__button')
const toggleAllBtn = document.querySelector('.todo__toggle-all')
const filterBtns = document.querySelectorAll('.footer__filter')
const footerCountBlock = document.querySelector('.footer__count')

const url = window.location.href
const activeString = '#/active'
const completedString = '#/completed'

let completedCount = 0
let notCompletedCount = 0

const addListenerKeyPressMouseOut = (item, callback, key = "Enter") => {
  item.addEventListener('focusout', () => callback())
  item.addEventListener('keypress', (e) => {
    if (e.key === key) {
      e.preventDefault()
      callback()
    }
  })
}

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
        <input class="todo__toggle" type="checkbox" ${completed && 'checked'}>
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

const handleCheckbox = (listItemCheckbox, todoNode, id) => {
  let addCompleted = 1

  listItemCheckbox.addEventListener('click', (e) => {
    let check = e.target.checked
    setCheckedTodo(id)
    listItemCheckbox.checked = check

    if (check && !todoNode.classList.contains('completed')) {
      // поставить галочку
      todoNode.classList.add('completed')
    }

    if (!check && todoNode.classList.contains('completed')) {
      // удалить галочку
      todoNode.classList.remove('completed')

      addCompleted = -1
    }

    completedCount += addCompleted
    notCompletedCount -= addCompleted
    setCompletedInfo()
  })
}

const handleEditLabel = (listItemLabel, todoNode, editInput) => {
  listItemLabel.addEventListener('dblclick', () => {
    todoNode.classList.add('editing')
    editInput.value = listItemLabel.innerText
    editInput.focus()
  })
}

const handleRemoveItem = (buttonItem, id) => {
  buttonItem.addEventListener('click', () => removeTodo(id))
}

const handleEditItem = (editInput, listItemLabel, todoNode, id) => {
  const editingEnds = () => {
    const title = editInput.value
    todoNode.classList.remove('editing')
    listItemLabel.innerText = title
    setTitleTodo(title, id)
  }

  addListenerKeyPressMouseOut(editInput, editingEnds, "Enter")
}

const addNodeEventListeners = (todoNode, id) => {
  const editInput = todoNode.children[1]

  const listItemCheckbox = todoNode.children[0].children[0]
  const listItemLabel = todoNode.children[0].children[1]
  const buttonItem = todoNode.children[0].children[2]

  handleCheckbox(listItemCheckbox, todoNode, id)
  handleEditLabel(listItemLabel, todoNode, editInput)
  handleRemoveItem(buttonItem, id)

  handleEditItem(editInput, listItemLabel, todoNode, id)
}

const addTodoToUL = (title, id, completed = false) => {
  const newTodoNode = createTodoNode(title, id, completed)
  addNodeEventListeners(newTodoNode, id)
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
  setCompletedInfo()
}

const removeTodo = (id) => {
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
  setCompletedInfo()
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

const setCompletedInfo = () => {
  setCompletedBlockVisible()
  setCountNotCompletedTodos()
}

// i = all || active || completed
const setFilterSelected = (filter) => {
  // если добавить ещё один фильтр, то расширить будет трудновато, но вряд ли его ведь добавят))
  const all = filterBtns[0].children[0]
  const active = filterBtns[1].children[0]
  const comp = filterBtns[2].children[0]

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
}

// обработчик нижних трех кнопок в футере
// на вход all, active, something
const handleShowItems = (filter) => {
  const items = Array.from(todoListUl.children)

  items.map(todoItem => {
    switch (filter) {
      case "all":
        if (todoItem.classList.contains('hide')) {
          todoItem.classList.remove('hide')
        }
        break;
      case "active":
        if (todoItem.classList.contains('completed')) {
          todoItem.classList.add('hide')
        } else if (todoItem.classList.contains('hide')) {
          todoItem.classList.remove('hide')
        }
        break;

      case "completed":
        if (!todoItem.classList.contains('completed')) {
          todoItem.classList.add('hide')
        } else if (todoItem.classList.contains('hide')) {
          todoItem.classList.remove('hide')
        }
        break;

      default:
        break;
    }
  })

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
  filterBtns.forEach(div => div.addEventListener('click', () => {
    const btn = div.children[0]
    const cn = btn.innerHTML.toLowerCase()
    handleShowItems(cn)
  }))

  clearBtn.addEventListener("click", () => clearCompleted())
  toggleAllBtn.addEventListener("click", () => toggleAllTodos())

  addListenerKeyPressMouseOut(newTodoInput, createTodo, "Enter")
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