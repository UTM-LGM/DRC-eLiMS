export interface K3Detail {
    details: any;
    find(arg0: (detail: { itemDescription: any; }) => boolean): unknown;
    showRemarks: any;

    status: string;
    numberValue: any;

    //sampleId: number;
    k1DetailId: number;
    k1HeaderId: number;

    batchId: number;
    rubberTypeId: number;
    sampleTypeId: number;
    rubberType: string;
    sampleType: string;
    typeCode: string;
    labRefNo: string;
    customNo: string;
    quantity: number;
    typeCodeId: number;
    companyId: number;
    companyName: string;
    importNo: number;
    createdOn: Date;
    createdBy: string;
    sentOn: Date;
    sentBy: string;
    receivedOn: Date;
    receivedBy: string;
    inLabOn: string;
    inLabBy: string;
    testedOn: string;
    testedBy: string;
    verifiedOn: string;
    verifiedBy: string;
    printedOn: string;
    printedBy: string;
    labelTestedOn: Date;
    labelTestedBy: string;
    resultSentOn: string;
    resultSentBy: string;
    labelPrinted: boolean;
    forwarderId: number;
    approvedOn: string;
    approvedBy: string;
    repeat: boolean;
    labelPrintedOn: Date;
    labelPrintedBy: string;
    registeredByCustoms: boolean;
    resultLetterApprovedBy: string;
    noOfRetest: number;
    repeatPrintKeputusan: boolean;
    noOfReprint: number;
    samplePropose: string;
    drc: number;
    dryWeight: number;
    supplierName: string;
    country: string;
    remarks: string;
    evidence: string;
    hsCode: string;
    passport: string;
    transport: string;

    checked: boolean;
    autoPaging?: boolean;

    itemDescription: string;
    tariffCode: string;
    tariffCodeNew: string;
    statusCodeId: number;
    sampleIdNew: number;
    isSMK: boolean;
    importerName: string;
    importerAddress: string;
    registrationSeqNo: string;
    sampleRunNo: string;
    creatorRoleId: number;
    grossWeight: number;
    agentName: string;

    dateSampleReceived: Date;
    smkimportersCode: string;
    testMethod: string;

    worksheetTestOn: Date;


    customOffice: string;
    customAddress: string;
    customPostcode: number;
    forwarderPostcode: number;
    importedDate: Date;
    result: number;
    chequeAmount: number;
    bankName: string;
    chequeNo: string;
    date: string;
    transactionNo: string;
    ikmNo: string;
    staffPosition: string;
    uipRegNo: string;
    staffName: string;
    testMethodId: number;
    prove : string;
    catatan : string;
    dateReceivedInLab : Date;
    noLaporanTuan : string;

     forwarderName: string;
     forwarderAddress: string;

     penimbang: number;
     oven: number;

}