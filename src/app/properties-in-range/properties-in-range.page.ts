import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PropertyModel } from '../Models/properties/property-model';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { PropertiesService } from '../services/properties/properties.service';
import { SettingsService } from '../services/Settings/settings.service';

@Component({
    selector: 'properties-in-range',
    templateUrl: 'properties-in-range.page.html',
    styleUrls: ['properties-in-range.page.scss']
})
export class PropertiesInRangePage implements OnInit {

    displayedColumns: Array<string> = ['price', 'date', 'housetype', 'duration', 'address'];
    allPropertiesInRange: MatTableDataSource<PropertyModel> = new MatTableDataSource<PropertyModel>();

    private _sub: Subscription = new Subscription();
    private _loadingIndicator: HTMLIonLoadingElement;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private _propertiesService: PropertiesService,
                private _geo: GeoLocationService,
                private _settings: SettingsService,
                private _loader: LoadingController) {
    }

    ngOnInit(): void {
    }

    ionViewWillEnter(): void {
        this._loader.create({
            message: 'Please wait!'
        }).then(async overlay => {
            this._loadingIndicator = overlay;
            await overlay.present();
        });
        this._geo.currentLocation().then(geoPos => {
            this._propertiesService.getPropertiesInRadius({
                latitude: geoPos.coords.latitude,
                longitude: geoPos.coords.longitude,
                radius: this._settings.settings.distance
            })
                .subscribe(async (propertiesInRange: PropertyModel[]) => {
                    this.allPropertiesInRange = new MatTableDataSource<PropertyModel>(propertiesInRange);
                    this.allPropertiesInRange.paginator = this.paginator;
                    this.allPropertiesInRange.sort = this.sort;

                    await this._loadingIndicator.dismiss();
                }, async error => {
                    await this._loadingIndicator.dismiss();
                });
        });
    }

    ionViewWillLeave(): void {
        this._sub.unsubscribe();
    }

    applyFilter(value: string) {
        this.allPropertiesInRange.filter = value.trim().toLowerCase();
        this.allPropertiesInRange.filterPredicate = function(data, filter) {
            const checkValue = filter.replace(/ /g, '');

            if ((checkValue.includes('$price') && checkValue.includes('>')) && !checkValue.includes('&')) {
                return data.price > Number(checkValue.replace('$price>', '').trim());
            }
            if ((checkValue.includes('$price') && checkValue.includes('<')) && !filter.includes('&')) {
                return data.price < Number(checkValue.replace('$price<', '').trim());
            }
            if (checkValue.includes('&')) {
                const indexOfAnd = checkValue.indexOf('&');
                let parseStringFirstHalf = checkValue.substr(0, indexOfAnd).replace('&', '');
                let parseStringSecondHalf = checkValue.substr(indexOfAnd - 1, checkValue.length).replace('&', '');

                // first check if condition is between
                if (parseStringFirstHalf.includes('$price') && parseStringSecondHalf.includes('$price')) {
                    // user is doing an in between search
                    // Get greater than value
                    let greaterThanValue;
                    let lessThanValue;
                    if (parseStringSecondHalf.includes('>')) {
                        greaterThanValue = Number(parseStringSecondHalf.replace('$price>', '').trim());
                    } else if (parseStringSecondHalf.includes('<')) {
                        lessThanValue = Number(parseStringSecondHalf.replace('$price<', '').trim());
                    }
                    if (parseStringFirstHalf.includes('>')) {
                        greaterThanValue = Number(parseStringFirstHalf.replace('$price>', '').trim());
                    } else if (parseStringFirstHalf.includes('<')) {
                        lessThanValue = Number(parseStringFirstHalf.replace('$price<', '').trim());
                    }

                    return (data.price > Number(greaterThanValue) && data.price < Number(lessThanValue));
                }
            }
            return data.housetype.includes(value)
                || data.price.toString() === value
                || data.date.toString() === value
                || data.address.toLowerCase().includes(value.toLowerCase());
        };
    }

}
