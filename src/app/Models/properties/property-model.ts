export class PropertyModel {
    constructor(public id?: string,
                public price?: number,
                public date?: string,
                public housetype?: 'Detached' | 'Flat' | 'Semi-detached' | 'Terraced' | 'Unknown',
                public newProperty?: boolean,
                public duration?: string,
                public address?: string,
                public longitude?: number,
                public latitude?: number
    ) {
    }
}
