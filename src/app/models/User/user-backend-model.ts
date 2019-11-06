import { IDeviceBackendModel } from '~/app/models/Device/device-backend-model';
import { ILocationBackendModel } from '~/app/models/Location/location-backend-model';

export interface IUserBackendModel {
    country?: string;
    city?: string;
    location: Array<ILocationBackendModel>;
    name: string;
    device: IDeviceBackendModel;
}
