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
      // поставить галочку
      listItem.classList.add('completed')
      completedCount += 1
      notCompletedCount -= 1
      setCompletedBlockVisible()
      setCountNotCompletedTodos()
    }
    if (!check && listItem.classList.contains('completed')) {
      // удалить галочку
      listItem.classList.remove('completed')
      completedCount -= 1
      notCompletedCount += 1
      setCompletedBlockVisible()
      setCountNotCompletedTodos()
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

  notCompletedCount += 1
  setCountNotCompletedTodos()
}

const removeTodo = (id) => {
  const todoCompleted = todoList.find(x => x.id === id).completed

  const newArray = todoList.filter(todo => todo.id.toString() !== id.toString())
  todoList = newArray

  if (todoCompleted) {
    completedCount -= 1
  } else {
    notCompletedCount -= 1
  }

  todoListUl.innerHTML = ""
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


// i = 0, 1, 2
const setFilterSelected = (i) => {
  // если добавить ещё один фильтр, то расширить будет трудновато, но вряд ли его ведь добавят))
  const all = filterAllBtn.children[0]
  const active = filterActiveBtn.children[0]
  const comp = filterCompletedBtn.children[0]

  const cn = 'selected'

  if (i === 0) {
    if (all.classList.contains(cn)) {
      return
    } else {
      if (active.classList.contains(cn)) {
        active.classList.remove(cn)
      } else {
        comp.classList.remove(cn)
      }

      all.classList.add(cn)
      return
    }
  }

  if (i === 1) {
    if (active.classList.contains(cn)) {
      return
    } else {
      if (all.classList.contains(cn)) {
        all.classList.remove(cn)
      } else {
        comp.classList.remove(cn)
      }

      active.classList.add(cn)
      return
    }
  }

  if (i === 2) {
    if (comp.classList.contains(cn)) {
      return
    } else {
      if (active.classList.contains(cn)) {
        active.classList.remove(cn)
      } else {
        all.classList.remove(cn)
      }

      comp.classList.add(cn)
      return
    }
  }
  // не свитч кейс просто потому что так хочется

  console.log('Ошибка в setFilterSelected, передано некорректное значение. Принимаются только 0, 1 и 2')
}

// обработчики нижних трех кнопок в футере
const showAll = () => {
  const children = todoListUl.children;
  for (let i = 0; i < children.length; i++) {
    const currentChild = children[i]
    if (currentChild.classList.contains('hide')) {
      currentChild.classList.remove('hide')
    }
  }

  setFilterSelected(0)
}

const showActive = () => {
  const children = todoListUl.children;
  for (let i = 0; i < children.length; i++) {
    const currentChild = children[i]
    if (currentChild.classList.contains('completed')) {
      currentChild.classList.add('hide')
    } else if (currentChild.classList.contains('hide')) {
      currentChild.classList.remove('hide')
    }
  }

  setFilterSelected(1)
}

const showCompleted = () => {
  const children = todoListUl.children;
  for (let i = 0; i < children.length; i++) {
    const currentChild = children[i]
    if (!currentChild.classList.contains('completed')) {
      currentChild.classList.add('hide')
    } else if (currentChild.classList.contains('hide')) {
      currentChild.classList.remove('hide')
    }
  }

  setFilterSelected(2)
}

// удаление всех отмеченных тасков
const clearCompleted = () => {
  const newArray = todoList.filter(todo => todo.completed !== true)
  todoList = newArray

  completedCount = 0

  todoListUl.innerHTML = ""
  initializeTodos(todoList)
  setTodosLS()
}



const addEventListeners = () => {
  filterAllBtn.addEventListener('click', () => showAll())
  filterActiveBtn.addEventListener('click', () => showActive())
  filterCompletedBtn.addEventListener('click', () => showCompleted())

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

let todoList = JSON.parse(getTodosLS())

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