import { staffRole } from "./staffRole";

export class userDTO {
    username: string;
    password: string;
    forwarderId: number;
    customOfficeId: number;
    staffId: string;
    role: staffRole[];

    name : string;
    address : string;
    importerAddress : string;
}