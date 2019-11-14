import {LocationModel} from '../geolocation/location.model';
import {DeviceModel} from './device.model';

export class UserModel {
    constructor(public id?: string,
                public country?: string,
                public city?: string,
                public location: LocationModel[] = [],
                public name: string = '',
                public password: string = '',
                public device: DeviceModel = null
    ) {
    }
}
