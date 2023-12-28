
export interface Forwarder {
    filter(arg0: (data: any) => boolean): any;
    forwarderId: number;
    name: string;
    address: string;
    postcode: string;
    tel: string;
    email: string;
    fax: string;
    contactPerson: string;
    customOfficeId: string;
    code:string;
    refNo:string;
    username:string;
    password:string;
}