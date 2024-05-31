import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { ElimsService } from '../../services/elims.service';
import * as html2pdf from 'html2pdf.js';
import { CetakWorksheetService } from '../cetak-worksheet.service';
import { K1Detail } from '../../models/k1Detail';

@Component({
  selector: 'app-cetak-worksheet',
  templateUrl: './cetak-worksheet.component.html',
  styleUrls: ['./cetak-worksheet.component.css']
})
export class CetakWorksheetComponent {
  @Input() k1DetailId: number[];
  statusCodeId: number = 0;
  batches: Batch[] = [];
  k1Details: K1Detail[] = [];
  rubberTypes: any
  rubberTypeId: any;
  qrData: string = "";

  constructor(
    private elimsService: ElimsService,
    private cetakWorksheetService: CetakWorksheetService,
  ) { }

  ngOnInit() {

    this.k1DetailId.forEach(element => {
      this.cetakWorksheetService.GetElimsSample(element).subscribe(data => {
        this.k1Details.push(data);
        console.log(this.k1Details)
       

      });

    })


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
      console.log(this.rubberTypes)
    })

  }


  callGeneratePdf(){
    // setTimeout(() => {
      this.generatePdf();
    // }, 1000); // Adjust the delay as needed
  }


  @ViewChild('pdfContent', { static: true }) pdfContent: ElementRef | undefined;

  generatePdf(): void {

    const element = document.getElementById('pdfContent');

    // Check if the element is null before proceeding
    if (!element) {
      console.error("Element with ID 'pdfContent' not found.");
      return;
    }

    // Set font size inline in the HTML content
    const content = element.innerHTML;
    const styledContent = `<div style="font-size: 12px;">${content}</div>`;

    var opt = {
      // margin: [0.2, 0.5, 0.5, 0.5],
      filename: 'cetakWorksheet.pdf',
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'in',
        format: 'A4',
        orientation: 'portrait',
        font: 'times',
      },
    };

    // Replace the original content with the modified content
    element.innerHTML;

    // Generate PDF
    html2pdf().from(element).set(opt).outputPdf().then((pdfBlob) => {
      // Restore the original content
      element.innerHTML = content;

      // Save the blob or trigger a download as needed
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = 'cetakWorksheet.pdf';
      downloadLink.click();
    }); html2pdf(element, opt);

  }


}
