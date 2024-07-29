import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoticeService } from '../notice.service';
import { Notice } from '../../models/notice';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-view-notice',
  templateUrl: './view-notice.component.html',
  styleUrls: ['./view-notice.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
  
})
export class ViewNoticeComponent implements OnInit {
  notisList: Notice[] = [];
  selectedNotices: Notice[] = []; // Array to track selected notices

  constructor(
    private noticeService: NoticeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.noticeService.GetNotices().subscribe(notis => {
      this.notisList = notis;
      this.notisList = notis.sort((a, b) => b.id - a.id);
    });
  }

  onCheckboxChange(notice: Notice): void {
    // Update the selectedNotices array based on checkbox changes
    if (notice.isShow) {
      this.selectedNotices = this.notisList.filter(n => n.isShow);
    } else {
      this.selectedNotices = this.notisList.filter(n => n.isShow);
    }
  }

  // onSubmit(): void {
  //   const updatedNotices = this.notisList.map(notice => ({
  //     id: notice.id,
  //     isShow: notice.isShow
  //   }));
  
  //   this.noticeService.PutNotice(updatedNotices).subscribe({
  //     next: () => {
  //       // Navigate to /show-notice route upon successful update
  //       this.router.navigate(['/show-notice']);
  //     },
  //     error: (error) => {
  //       console.error('Error updating notices', error);
  //     }
  //   });
  // }

  onSubmit(): void {
    const updatedNotices = this.notisList.map(notice => ({
      id: notice.id,
      isShow: notice.isShow
    }));
    
    this.noticeService.PutNotice(updatedNotices).subscribe({
      next: () => {
        // Store selected notices in local storage
        const selectedNotices = this.notisList.filter(notice => notice.isShow);
        localStorage.setItem('selectedNotices', JSON.stringify(selectedNotices));
        
        // Navigate to /show-notice route upon successful update
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error updating notices', error);
      }
    });
  }
  


  onDelete(notice: Notice): void {
    // Remove the notice from the list
    this.notisList = this.notisList.filter(n => n !== notice);
    
    // Optionally, send a request to delete the notice from the backend
    this.noticeService.DeleteNotice(notice.id).subscribe({
      next: () => {
        console.log('Notice deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting notice', error);
      }
    });
  }

  onEdit(notice: Notice): void {
    // Logic to handle editing the notice
    
    console.log('Edit notice', notice);
  }


  navigateToShowNotice(): void {
    this.router.navigate(['/notice']);
  }

}
