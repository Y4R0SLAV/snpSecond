const todoListUl = document.querySelector('.todo__items')

const newTodoInput = document.querySelector(".header__new-todo")
const clearBtn = document.querySelector('.footer__button')
const toggleAllBtn = document.querySelector('.todo__toggle-all')
const filterBtns = document.querySelectorAll('.footer__filter')
const footerCountBlock = document.querySelector('.footer__count')

const activeString = '#/active'
const completedString = '#/completed'

let completedCount = 0
let notCompletedCount = 0

const handleKeyPressMouseOut = (item, callback, key = "Enter") => {
  item.addEventListener('focusout', (e) => callback(e))
  item.addEventListener('keypress', (e) => {
    if (e.key === key) {
      e.preventDefault()
      callback(e)
    }
  })
}

const getTodosLS = () => {
  return localStorage.getItem('todos')
}

const setTodosLS = (changedTodoList = []) => {
  if (changedTodoList.length > 0) {
    todoList = changedTodoList
    localStorage.setItem('todos', JSON.stringify(changedTodoList))
  } else {
    localStorage.setItem('todos', JSON.stringify(todoList))
  }
}

const createTodoNode = (title, id, completed) => {
  const todoItem = `
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

  todoNode.innerHTML = todoItem
  return todoNode
}

const handleEditingEnds = (e) => {
  const title = e.target.value
  const todoNode = e.target.parentNode
  const listItemLabel = todoNode.querySelector(".todo__text")
  const id = todoNode.id

  todoNode.classList.remove('editing')
  listItemLabel.innerText = title
  setTitleTodo(title, id)
}

const handleCheckbox = (e) => {
  let addCompleted = 1

  const todoNode = e.target.parentNode.parentNode
  const listItemCheckbox = todoNode.querySelector(".todo__toggle")
  const id = todoNode.id

  let check = e.target.checked
  toggleCheckedTodo(id)
  listItemCheckbox.checked = check

  if (check && !todoNode.classList.contains('completed')) {
    todoNode.classList.add('completed')
  }

  if (!check && todoNode.classList.contains('completed')) {
    todoNode.classList.remove('completed')
    addCompleted = -1
  }

  completedCount += addCompleted
  notCompletedCount -= addCompleted
  setCompletedInfo()
}

const addNodeEventListeners = (todoNode, id) => {
  const editInput = todoNode.querySelector(".todo__edit")

  const listItemCheckbox = todoNode.querySelector(".todo__toggle")
  const listItemLabel = todoNode.querySelector(".todo__text")
  const buttonItem = todoNode.querySelector(".todo__remove")

  buttonItem.addEventListener('click', () => removeTodo(id))

  listItemLabel.addEventListener('dblclick', () => {
    todoNode.classList.add('editing')
    editInput.value = listItemLabel.innerText
    editInput.focus()
  })

  listItemCheckbox.addEventListener('click', handleCheckbox)

  handleKeyPressMouseOut(editInput, handleEditingEnds, "Enter")
}

const addTodoToUL = (title, id, completed = false) => {
  const newTodoNode = createTodoNode(title, id, completed)
  addNodeEventListeners(newTodoNode, id)
  todoListUl.appendChild(newTodoNode)
}

const createTodo = () => {
  const title = newTodoInput.value

  if (title.trim() === "") {
    return
  }


  const id = Date.now().toString()
  newTodoInput.value = ""

  addTodoToUL(title, id)

  setTodosLS([...todoList, { title, id, completed: false }])

  notCompletedCount += 1
  setCompletedInfo()
}

const removeTodo = (id) => {
  const todoListWithoutItem = todoList.filter(todo => todo.id.toString() !== id.toString())
  todoList = todoListWithoutItem
  todoListUl.innerHTML = ""

  initializeTodos(todoList)
  setTodosLS()
}

const initializeTodos = () => {
  todoListUl.innerHTML = ''
  completedCount = 0

  const url = window.location.href

  todoList.forEach(item => {
    addTodoToUL(item.title, item.id, item.completed)

    if (item.completed) {
      completedCount += 1
    }
  })

  notCompletedCount = todoList.length - completedCount
  setCompletedInfo()

  if (url.includes(activeString)) {
    handleShowItems("active")
  } else if (url.includes(completedString)) {
    handleShowItems("completed")
  }
}

const setTitleTodo = (title, id) => {
  const todoListWithChangedItem = todoList.map((todo) => {
    if (todo.id.toString() === id.toString()) {
      todo.title = title
    }
    return todo
  })

  setTodosLS(todoListWithChangedItem)
}

const toggleCheckedTodo = (id) => {
  const todoListWithCheckedItem = todoList.map((todo) => {
    if (todo.id.toString() === id.toString()) {
      todo.completed = !todo.completed
    }
    return todo
  })

  setTodosLS(todoListWithCheckedItem)
  initializeTodos()
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

  if (localCompletedCount === len) {
    allIdsList.forEach(id => toggleCheckedTodo(id))
  } else {
    notCheckedIdsList.forEach(id => toggleCheckedTodo(id))
  }

  initializeTodos()
}

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
  let secondPart = notCompletedCount === 1 ? ' item left' : ' items left'

  footerCountBlock.innerHTML = firstPart + secondPart
}

const setCompletedInfo = () => {
  setCompletedBlockVisible()
  setCountNotCompletedTodos()
}

const setFilterSelected = (filter) => {
  const all = filterBtns[0].children[0]
  const active = filterBtns[1].children[0]
  const comp = filterBtns[2].children[0]

  const cn = 'selected'
  document.querySelector('a.' + cn).classList.remove(cn)

  switch (filter) {
    case 'all':
      all.classList.add(cn)
      break;
    case 'active':
      active.classList.add(cn)
      break;
    case 'completed':
      comp.classList.add(cn)
      break;

    default:
      break;
  }
}

const handleShowItems = (filter) => {
  const items = Array.from(todoListUl.children)

  items.forEach(todoItem => {
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

const clearCompleted = () => {
  const todoListWithoutCompleted = todoList.filter(todo => todo.completed !== true)
  todoList = todoListWithoutCompleted

  todoListUl.innerHTML = ""
  initializeTodos(todoListWithoutCompleted)
  setTodosLS()
}

const creatingListeners = () => {
  filterBtns.forEach(div => div.addEventListener('click', () => {
    const btn = div.children[0]
    const cn = btn.innerHTML.toLowerCase()
    handleShowItems(cn)
  }))

  clearBtn.addEventListener("click", () => clearCompleted())
  toggleAllBtn.addEventListener("click", () => toggleAllTodos())

  handleKeyPressMouseOut(newTodoInput, createTodo, "Enter")
}

let todoList = JSON.parse(getTodosLS()) || []

const initializeApp = () => {
  creatingListeners()
  initializeTodos()
}

initializeApp()