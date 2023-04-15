import { Component, Input } from '@angular/core';
import { Book } from 'src/app/core/models/book-response.model';

@Component({
  selector: 'front-end-internship-assignment-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent {
  @Input() topOrNext : string = 'Top';
  @Input() booksList: Book[] = [];
  @Input() subjectName: string = '';
}
