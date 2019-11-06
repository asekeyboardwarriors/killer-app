export class LocationModel {
    private _timestamp: number;
    private _latitude: string;
    private _longitude: string;

    constructor(timestamp = 0, latitude = '', longitude = '') {
        this._timestamp = timestamp;
        this._latitude = latitude;
        this._longitude = longitude;
    }

    get timestamp(): number {
        return this._timestamp;
    }

    set timestamp(value: number) {
        this._timestamp = value;
    }

    get latitude(): string {
        return this._latitude;
    }

    set latitude(value: string) {
        this._latitude = value;
    }

    get longitude(): string {
        return this._longitude;
    }

    set longitude(value: string) {
        this._longitude = value;
    }
}
