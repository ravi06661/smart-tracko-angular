import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationManager } from '../entity/pagination-manager';
import { PageRequest } from '../payload/page-request';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  ngOnInit(): void {
    console.log('-pagination');

  }

  @Input() paginationManager !: PaginationManager
  @Input() pageRequest!: PageRequest
  @Input() data: any
  @Output() eventEmit = new EventEmitter<any>();


  ManageNextPrev(data: any) {
   // this.eventEmit.emit(data)
  }
  getData(data: any) {
    this.eventEmit.emit(data)
  }

}
