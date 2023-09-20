import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodoStore } from './todo.store';
import { provideComponentStore } from '@ngrx/component-store';
import { Todo } from './todo.model';
import { generateUUID } from '../utils/uuid-generator';
import { AsyncPipe, JsonPipe, NgFor, NgIf, NgClass } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-todo',
  template: `
    <div class="heading">Todo App</div>

    <ng-container *ngIf="vm$ | async as vm">
      <div class="form">
        <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
          <input type="hidden" formControlName="id" />
          <input type="hidden" formControlName="completed" />
          <ion-input
            placeholder="add new todo"
            formControlName="title"
          ></ion-input>
          <ion-button
            expand="full"
            type="submit"
            [disabled]="todoForm.invalid"
            >{{ vm.action }}</ion-button
          >
        </form>
      </div>
      <ng-container *ngIf="vm.todos && vm.todos.length > 0; else nodata">
        <ion-list *ngFor="let todo of vm.todos">
          <ion-item>
            <ion-checkbox
              (ionChange)="toggleComplete(todo)"
              slot="start"
              aria-label="toggleComplete"
              [value]="todo.completed"
            ></ion-checkbox>

            <ion-label [ngClass]="{ 'line-through': todo.completed }">{{
              todo.title
            }}</ion-label>
            <ion-button
              color="secondary"
              slot="end"
              size="small"
              (click)="onEdit(todo)"
              ><ion-icon name="pencil" aria-hidden="true"></ion-icon
            ></ion-button>
            <ion-button
              slot="end"
              color="danger"
              size="small"
              (click)="onDelete(todo.id)"
              ><ion-icon name="trash" aria-hidden="true"></ion-icon
            ></ion-button>
          </ion-item>
        </ion-list>
      </ng-container>
      <ng-template #nodata> No content found </ng-template>
    </ng-container>
  `,
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgIf,
    NgFor,
    NgClass,
    IonicModule,
    ReactiveFormsModule,
  ],
  styles: [
    `
      .heading {
        font-weight: bold;
        font-size: 20px;
        text-align: center;
        margin: 10px 0;
      }
      .form {
        padding: 10px;
      }
      .line-through {
        text-decoration: line-through;
      }
    `,
  ],
  providers: [provideComponentStore(TodoStore)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  private readonly store = inject(TodoStore);
  vm$ = this.store.vm$;
  todoForm = new FormGroup({
    id: new FormControl(''),
    completed: new FormControl(false),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
  });
  onSubmit() {
    const todo: Todo = Object.assign(this.todoForm.value);
    // const title = this.todoForm.get('title')?.value ?? '';
    if (!todo.id)
      this.store.addTodo({ ...todo, id: generateUUID(), completed: false });
    else this.store.updateTodo(todo);
    this.todoForm.reset();
    this.store.setAction('Add');
  }

  onEdit(todo: Todo) {
    this.todoForm.patchValue(todo);
    this.store.setAction('Update');
  }

  toggleComplete(todo: Todo) {
    this.store.updateTodo({
      ...todo,
      completed: !todo.completed,
    });
  }

  onDelete(id: string) {
    if (window.confirm('Are you sure?')) {
      this.store.deleteTodo(id);
    }
  }
}
