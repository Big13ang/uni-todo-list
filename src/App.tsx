import { useReducer, useState } from 'react';

type Todo = {
  id: string;
  done: boolean;
  title: string;
};

type State = {
  todos: Todo[];
};

enum ACTION_TYPES {
  ADD_TODO = "ADD_TODO",
  DELTE_TODO = "DELTE_TODO",
  EDIT_TODO = "EDIT_TODO",
  TOGGLE_DONE = "TOGGLE_DONE",
}

type Action =
  | { type: ACTION_TYPES.ADD_TODO; payload: Todo['title'] }
  | { type: ACTION_TYPES.DELTE_TODO; payload: Todo['id'] }
  | { type: ACTION_TYPES.EDIT_TODO; payload: { title: Todo['title']; id: Todo['id'] } }
  | { type: ACTION_TYPES.TOGGLE_DONE; payload: Todo['id'] };

const initialState: State = {
  todos: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTION_TYPES.ADD_TODO:
      return {
        todos: [...state.todos, { id: crypto.randomUUID(), done: false, title: action.payload }],
      };
    case ACTION_TYPES.TOGGLE_DONE:
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, done: !todo.done } : todo
        ),
      };
    case ACTION_TYPES.DELTE_TODO:
      return {
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case ACTION_TYPES.EDIT_TODO:
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo
        ),
      };
    default:
      throw new Error('Unknown action');
  }
}

const TodoItem = ({ todo, toggleDone, deleteTodo, editTodo }: {
  todo: Todo;
  toggleDone: () => void;
  deleteTodo: () => void;
  editTodo: (newTitle: string) => void
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleEditSave = () => {
    editTodo(editTitle);
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, width: '100%' }}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={toggleDone}
        style={{ marginRight: 8 }}
      />
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{ flex: 1, fontSize: 16, padding: 4, marginRight: 16 }}
        />
      ) : (
        <span
          style={{
            textDecoration: todo.done ? 'line-through' : 'none',
            color: todo.done ? '#888' : '#fff',
            fontSize: 16,
            flex: 1,
            marginRight: 16,
          }}
        >
          {todo.title}
        </span>
      )}
      {isEditing ? (
        <button onClick={handleEditSave} style={{ marginRight: 8 }}>Save</button>
      ) : (
        <button onClick={() => setIsEditing(true)} style={{ marginRight: 8 }}>Edit</button>
      )}
      <button onClick={deleteTodo} style={{ color: '#ff3c3c' }}>Delete</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    dispatch({ type: ACTION_TYPES.ADD_TODO, payload: newTodo });
    setNewTodo('');
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontFamily: 'Arial', fontSize: 24 }}>My TODO List</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={{ padding: 8, fontSize: 16, marginRight: 8, width: 200 }}
        />
        <button onClick={handleAddTodo} style={{ padding: 8, fontSize: 16 }}>Add</button>
      </div>

      {state.todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleDone={() =>
            dispatch({ type: ACTION_TYPES.TOGGLE_DONE, payload: todo.id })
          }
          deleteTodo={() =>
            dispatch({ type: ACTION_TYPES.DELTE_TODO, payload: todo.id })
          }
          editTodo={(newTitle: string) =>
            dispatch({ type: ACTION_TYPES.EDIT_TODO, payload: { id: todo.id, title: newTitle } })
          }
        />
      ))}
    </div>
  );
};

export default App;
