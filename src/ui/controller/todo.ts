import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
  page?: number;
}

async function get({ page }: TodoControllerGetParams = {}) {
  return todoRepository.get({
    // te dou o numero da pagina ou a pagina 1
    page: page || 1,
    limit: 10,
  });
}

export const todoController = {
  get,
};
