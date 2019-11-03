import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'Block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() isLoading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
