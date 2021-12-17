import React, { createContext, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import {
  render,
  cleanup,
  fireEvent
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import { Todos } from './TodoStore'

afterEach(cleanup)

const TodosStore = createContext(new Todos())

const TodosTest = observer(() => {
  const data = useContext(TodosStore)

  return (
    <>
      <ul data-testid="todoList">
        {data.todos.map((t, i) => (
          <li onClick={() => data.toggleTodo(i)} key={t.id}>
            {t.text}
          </li>
        ))}
      </ul>
      <span data-testid="footer">
        {data.remainingTodos} / {data.todos.length} left
      </span>
    </>
  )
})

// tests
describe(`test the todo component`, () => {
  it(`should render the todos correctly`, () => {
    const { getByTestId } = render(<TodosTest />)
    const [ul, footer] = [
      getByTestId('todoList'),
      getByTestId('footer')
    ]

    expect(ul.children.length).toBe(2)
    expect(footer.textContent).toContain('1 / 2')
  })

  it(`should change footer text on toggle of list item`, () => {
    const { getByTestId } = render(<TodosTest />)
    const [ul, footer] = [
      getByTestId('todoList'),
      getByTestId('footer')
    ]

    fireEvent.click(ul.firstChild)
    expect(footer.textContent).toContain('2 / 2')
    fireEvent.click(ul.children[1])
    expect(footer.textContent).toContain('1 / 2')
  })
})
