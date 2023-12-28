
export interface Company {
    filter(arg0: (data: any) => boolean): any;

    companyId: number;
    name: string;
    address: string;
    postcode: string;
    tel: string;
    email: string;
    fax: string;
    contactPerson: string;
    code: string;
    username: string;
    password: string;
    importerName:string;
}