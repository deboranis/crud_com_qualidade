// dados que estamos pegando, qual pagina está e qual limite por página
interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  pages: number;
  totalPages: number;
}

export function get({ page, limit }: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch("api/todos")
  .then(async respostaDoServidor => {
    const todosString = await respostaDoServidor.text();
    const todosFromServer = parseTodosFromServer(JSON.parse(todosString)).todos;
    const ALL_TODOS = todosFromServer;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(ALL_TODOS.length / limit);
    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
    return {
      todos: paginatedTodos,
      totalPages: ALL_TODOS.length,
      pages: totalPages,
    };
  });
}

export const todoRepository = {
  get,
}

// model/schema, o dado que a gente ta recebendo pra poder trabalhar
interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}

function parseTodosFromServer(responseBody: unknown): { todos: Array<Todo> } {
  //converter tipo desconhecido pra algo conhecido
  if(responseBody !== null &&
    typeof responseBody === "object" &&
    "todos" in responseBody &&
    Array.isArray(responseBody.todos)) {
      return {
        todos: responseBody.todos.map((todo: unknown) => {
          if (todo === null && typeof todo !== "object") {
            throw new Error("Invalid todo from API!")
          }
          const { id, content, done, date } = todo as {
            id: string,
            content: string,
            done: string,
            date: string,
          }
          return {
            id,
            content,
            done: String(done).toLowerCase() === "true",
            date: new Date(date),
          }
        }),
      };
  }
  return {
    todos: [],
  }
}
