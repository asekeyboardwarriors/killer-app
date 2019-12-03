export class PropertiesModel {
    constructor(public id?: string,
                public price?: number,
                public date?: string,
                public housetype?: string,
                public newProperty?: boolean,
                public duration?: string,
                public address?: string,
                public longitude?: number,
                public latitude?: number
    ) {
    }
}
