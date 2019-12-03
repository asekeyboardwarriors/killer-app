import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { GeolocationPosition } from '@capacitor/core';
import { LatLng, latLng, Layer, LayerGroup, Map, MapOptions, tileLayer } from 'leaflet';
import { Subscription } from 'rxjs';
import { PropertiesModel } from '../Models/properties/properties-model';
import { UserModel } from '../Models/user/user.model';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { SettingsService } from '../services/Settings/settings.service';

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
