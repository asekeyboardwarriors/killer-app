export class RadiusModel {
    constructor(private _radius: number,
                private _longitude: number,
                private _latitude: number) {

    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    get longitude(): number {
        return this._longitude;
    }

    set longitude(value: number) {
        this._longitude = value;
    }

    get latitude(): number {
        return this._latitude;
    }

    set latitude(value: number) {
        this._latitude = value;
    }
}
