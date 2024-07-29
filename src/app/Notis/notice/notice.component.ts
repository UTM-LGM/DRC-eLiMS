import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoticeService } from '../notice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent {

  notisForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private noticeService : NoticeService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notisForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.notisForm.valid) {
      console.log('Form Submitted', this.notisForm.value);
      this.noticeService.PostNotice(this.notisForm.value).subscribe({
        next: (response) => {
          console.log('Notice added successfully', response);
          this.toastr.success('Notice added successfully!', 'Success');
          this.router.navigate(['/view-notice']);
          // Handle successful response here (e.g., show a success message)
        },
        error: (error) => {
          console.error('Error adding notice', error);
          // Handle error response here (e.g., show an error message)
        }
      });
    }
  }


}
