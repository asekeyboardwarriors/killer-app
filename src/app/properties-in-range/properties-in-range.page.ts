import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { PropertyModel } from '../Models/properties/property-model';
import { PropertiesService } from '../services/properties/properties.service';

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
  allPropertiesInRange: PropertyModel[];

  private _sub: Subscription = new Subscription();
  private _loadingIndicator: HTMLIonLoadingElement;

  constructor(private _propertiesService: PropertiesService,
              private _loader: LoadingController) {
  }

  ionViewWillEnter(): void {
    this._loader.create({
      message: 'Please wait :D!'
    }).then( async overlay => {
      this._loadingIndicator = overlay;
      await overlay.present();
    });
    this._propertiesService.getRandomProperties()
        .subscribe(async (propertiesInRange: PropertyModel[]) => {
          this.allPropertiesInRange = propertiesInRange;
          await this._loadingIndicator.dismiss();
        }, async error => {
          await this._loadingIndicator.dismiss();
        });
  }

  ionViewWillLeave(): void {
    this._sub.unsubscribe();
  }
}
