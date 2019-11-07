export class LocationModel {
    timestamp: number;
    latitude: string;
    longitude: string;

    constructor(timestamp = 0, latitude = '', longitude = '') {
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;
    }

}
