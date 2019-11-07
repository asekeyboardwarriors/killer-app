import { DeviceModel } from '~/app/models/Device/device-backend-model';
import { LocationModel } from '~/app/models/Location/location-backend-model';

export class UserModel {
    id?: string;
    country?: string;
    city?: string;
    location: Array<LocationModel>;
    name: string;
    device: DeviceModel;
    password: string;

    constructor(country = '',
                city = '',
                location: Array<LocationModel> = [],
                name = '',
                password = '',
                device: DeviceModel) {
        this.country = country;
        this.city = city;
        this.location = location;
        this.name = name;
        this.device = device;
    }
}
