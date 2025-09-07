import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter} from '../todos.models';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-filter-bar',
  imports: [
    CommonModule
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent {
  @Input() currentFilter: Filter | null = 'all';
  @Input() activeCount: number | null = 0;
  @Input() completedCount: number | null = 0;

  @Output() filterChange = new EventEmitter<Filter>();
  @Output() clearCompleted = new EventEmitter<void>();
}
