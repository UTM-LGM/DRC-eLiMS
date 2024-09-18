import { staffRole } from "./staffRole";

export class userDTO {
    username: string;
    password: string;
    forwarderId: number;
    customOfficeId: number;
    staffId: string;
    role: staffRole[];
    code: string;
    name : string;
    address : string;
    importerAddress : string;
    smkimporterCode : string;
   companyId: number;
}