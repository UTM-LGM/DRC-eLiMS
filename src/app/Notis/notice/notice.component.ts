import { Component } from '@angular/core';
import { NoticeService } from '../notice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Notice } from 'src/app/models/notice';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent {

  notice: Notice = {} as Notice;
  file: any | null;
  isSubmitting = false;

  constructor(
    private noticeService: NoticeService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  onSubmit(form: any): void {
    if (form.invalid) {
      this.toastr.error('Please fill in the required fields.', 'Error');
      return;
    }

    this.isSubmitting = true;  // Disable the button
    console.log(this.notice);

    this.noticeService.PostNotice(this.notice).subscribe({
      next: (res) => {
        console.log(res);
        // Post the file after the notice is posted
        this.noticeService.PostFile(res.id, this.file).subscribe({
          next: () => {
            console.log('File uploaded successfully');
            // this.toastr.success('Notice and file added successfully!', 'Success');
            this.router.navigate(['/view-notice']);
          },
          error: (fileError) => {
            console.error('Error uploading file:', fileError);
            // this.toastr.error('Error uploading file', 'Error');
            this.isSubmitting = false; // Enable the button if file upload fails
            this.router.navigate(['/view-notice']);
          }
        });
      },
      error: (noticeError) => {
        console.error('Error adding notice', noticeError);
        // this.toastr.error('Error adding notice', 'Error');
        this.isSubmitting = false; // Enable the button if notice addition fails
      }
    });

    this.toastr.success('Maklumat telah berjaya diisi', 'Berjaya');

  }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.notice.announcement = event.target.files[0].name;
    console.log(this.notice.announcement);
  }
}
