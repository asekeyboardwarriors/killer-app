import { Moment } from 'moment';
import { SimpleLocation } from '~/app/models/Location/simple-location';

export class LocationTransferModel {
    id: number;
    date: Moment;
    location: SimpleLocation;
}
