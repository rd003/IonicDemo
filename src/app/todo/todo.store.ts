import { Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
} from '@ngrx/component-store';
import { Todo } from './todo.model';
import { generateUUID } from '../utils/uuid-generator';

interface TodoState {
  todos: Todo[];
  action: 'Add' | 'Update';
  //   loading: boolean;
  //   error: HttpErrorResponse | null;
}

const _initalState: TodoState = {
  todos: [],
  action: 'Add',
  //   loading: false,
  //   error: null,
};

@Injectable()
export class TodoStore
  extends ComponentStore<TodoState>
  implements OnStoreInit, OnStateInit
{
  private readonly todos$ = this.select((a) => a.todos);
  private readonly action$ = this.select((a) => a.action);
  //   private readonly loading$ = this.select((a) => a.loading);
  //   private readonly error$ = this.select((a) => a.error);

  readonly vm$ = this.select(
    {
      todos: this.todos$,
      action: this.action$,
    },
    {
      debounce: true,
    }
  );

  //   private readonly setLoding = this.updater((state) => ({
  //     ...state,
  //     loading: true,
  //   }));

  readonly setAction = this.updater((state, action: 'Add' | 'Update') => ({
    ...state,
    action,
  }));

  readonly addTodo = this.updater((state, todo: Todo) => ({
    ...state,
    todos: [...state.todos, todo],
  }));

  // readonly updateTodo = this.updater((state, todo: Todo) => ({
  //   ...state,
  //   todos: state.todos.map((a) => (a.id === todo.id ? todo : a)),
  // }));
  readonly updateTodo = this.updater((state, todo: Todo) => {
    const updatedTodos = state.todos.map((a) => (a.id === todo.id ? todo : a));
    console.log(updatedTodos);
    return { ...state, todos: updatedTodos };
  });
  readonly deleteTodo = this.updater((state, id: string) => ({
    ...state,
    todos: state.todos.filter((a) => a.id !== id),
  }));

  ngrxOnStoreInit() {
    this.setState(_initalState);
  }

  ngrxOnStateInit() {
    const todo: Todo = {
      id: generateUUID(),
      title: 'add something',
      completed: false,
    };
    this.addTodo(todo);
  }
}
