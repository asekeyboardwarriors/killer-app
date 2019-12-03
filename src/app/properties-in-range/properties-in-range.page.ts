import { Component } from '@angular/core';

export interface PropertyArray {
  price: number;
  date: string;
  housetype: string;
  duration: string;
  address: string;
}

const ELEMENT_DATA: PropertyArray[] = [
  {
    price: 423,
    date: '1995-09-08',
    housetype: 'Detached',
    duration:
        'Leasehold',
    address: '17 Happy Road'
  },
  {
    price: 423,
    date: '1995-09-08',
    housetype: 'Detached',
    duration:
        'Freehold',
    address: '15 Slick Road'
  }
];

@Component({
  selector: 'properties-in-range',
  templateUrl: 'properties-in-range.page.html',
  styleUrls: ['properties-in-range.page.scss']
})
export class PropertiesInRangePage {

  displayedColumns: Array<string> = ['price', 'date', 'housetype', 'duration', 'address'];
  propertyArray = ELEMENT_DATA;
}
