import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

const bg = "/bg.jpeg";
const todos = [
    {
      "id": "5550a88a-50ca-448f-bbb0-c1480ee81f23",
      "date": "2023-03-27T00:07:51.718Z",
      "content": "Primeira TODO",
      "done": false
    },
    {
      "id": "ae800f92-2993-4278-9b1c-917da9c459b7",
      "date": "2023-03-27T00:07:51.718Z",
      "content": "Atualizada!",
      "done": false
    }
  ];

interface HomeTodo {
  id: string;
  content:string;
}

export default function HomePage() {
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(1);
  let [todos, setTodos] = React.useState<HomeTodo[]>([]);
  // verificando se existem mais paginas
  const hasMorePages = totalPages > page;
// useEffect pra impedir que ele execute esse bloco toda vez que a home for renderizada
React.useEffect(() => {
  todoController
  .get({ page })
  .then(({ todos, pages }) => {
    setTodos((oldTodos) => {
      return [ ...oldTodos, ...todos]
    });
    setTotalPages(pages);
  });
}, [page]);

  return (
    <main>
      <GlobalStyles />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form>
          <input type="text" placeholder="Correr, Estudar..." />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input type="text" placeholder="Filtrar lista atual, ex: Dentista" />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {todos.map(todo => {
              return (
                <tr key={todo.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{todo.id.substring(0, 4)}</td>
                  <td>
                    {todo.content}
                  </td>
                  <td align="right">
                    <button data-type="delete">Apagar</button>
                  </td>
                </tr>
              );
            })}
{/* 
            <tr>
                 <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                   Carregando...
                 </td>
               </tr>
 
               <tr>
                 <td colSpan={4} align="center">
                   Nenhum item encontrado
                 </td>
               </tr> */}
 
                {hasMorePages && (<tr>
                 <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                   <button
                     data-type="load-more"
                     onClick={() => setPage(page + 1)}
                   >
                     Página {page}, Carregar mais{" "}
                     <span
                       style={{
                         display: "inline-block",
                         marginLeft: "4px",
                         fontSize: "1.2em",
                       }}
                     >
                       ↓
                     </span>
                   </button>
                 </td>
               </tr>)}
          </tbody>
        </table>
      </section>
    </main>
  );
}
