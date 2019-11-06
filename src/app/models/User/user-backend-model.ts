import { DeviceModel } from '~/app/models/Device/device-backend-model';
import { LocationModel } from '~/app/models/Location/location-backend-model';

export class UserModel {
    private _country?: string;
    private _city?: string;
    private _location: Array<LocationModel>;
    private _name: string;
    private _device: DeviceModel;

    constructor(country = '',
                city = '',
                location: Array<LocationModel> = [],
                name = '',
                device: DeviceModel) {
        this._country = country;
        this._city = city;
        this._location = location;
        this._name = name;
        this._device = device;
    }

    get country(): string {
        return this._country;
    }

    set country(value: string) {
        this._country = value;
    }

    get city(): string {
        return this._city;
    }

    set city(value: string) {
        this._city = value;
    }

    get location(): Array<LocationModel> {
        return this._location;
    }

    set location(value: Array<LocationModel>) {
        this._location = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get device(): DeviceModel {
        return this._device;
    }

    set device(value: DeviceModel) {
        this._device = value;
    }
}
