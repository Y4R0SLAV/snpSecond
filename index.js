

const todoList = document.querySelector('.todo__items')
const btnAdd = document.querySelector(".add-todo")

console.log(todoList)

const addTodo = (todoBody) => {
  // вид туду айтема: в ли добавляется класс completed если завеоешн
  // <li class="" data-id="1">
  //   <div class="todo__item">
  //     <input class="todo__toggle" type="checkbox">
  //     <label class="todo__text"> Певрое задание</label>
  //     <button class="todo__remove"></button>
  //   </div>
  //  </li>
  const listItem = document.createElement("li")
  const blockItem = document.createElement("div")
  const listItemCheckbox = document.createElement("input")
  const listItemLabel = document.createElement("label")
  const buttonItem = document.createElement("button")

  const newTodo = document.createDocumentFragment()

  listItem.setAttribute('id', Date.now().toString())

  blockItem.classList.add('todo__item')

  listItemCheckbox.type = 'checkbox'
  listItemCheckbox.classList.add('todo__toggle')

  listItemLabel.classList.add('todo__text')
  listItemLabel.innerHTML = todoBody

  buttonItem.classList.add('todo__remove')

  listItem.appendChild(blockItem)
  blockItem.append(listItemCheckbox, listItemLabel, buttonItem)

  newTodo.append(listItem)

  todoList.appendChild(newTodo)
}

btnAdd.addEventListener("click", () => addTodo("раз раз раз"))

