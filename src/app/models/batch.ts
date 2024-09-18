export interface Batch {
    checked: boolean;

    samples: any;

    staffId(staffId: any): unknown;
    runNo: string;

    batchId: number;
    batchIdNew: number;
    upbrefNo: string;
    chequeNo: string;
    chequeAmount: number;
    sentOn: string;
    sentBy: string;
    letterPrinted: string;
    bankCode: string;
    letterPrintedOn: string;
    resultLetterPrinted: string;
    lgmletterRef: string;
    customsLetterPrinted: string;
    customsLetterPrintedDate: string;

    paymentOption: string;
    transactionNo: string;
    transactionDate: string;
    receipt: string;
    dateSampleDelivered: string;
    courierServices: string;
    trackingNo: string;
    delivery: string;
    date: Date;
    uipRegNo: string

    importedDate: Date;
    hsCode: string;
    driverName: string;
    icDriver: string;
    drc: number;
    quantity: number;

    forwarderName: string;
    unitName: string;
    suratIringan: string;
    testMethodId: number;
    testMethod: string;
    isFastTrack: boolean;
    memoPrinted: boolean;
    statusCodeId: number;
    position: string;
    rubberTypeId: number;
    k1DetailId: number;

    receivedOn: string;
    batchPrinted: boolean;
    daysSinceReceived : number;
    approvedOn : Date;

    postResultOn : Date;
    postResultDelivery : string;
    postResultCourierServices : string;
    postResultTrackingNo : string;
    inLabBy : string;
    creatorRoleId: number;
}