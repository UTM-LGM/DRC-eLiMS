import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoticeService } from '../notice.service';
import { Notice } from '../../models/notice';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/app/environments/environment';

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
  selectedNotices: Notice[] = [];
  baseApiUrlElimsAnnouncement = environment.baseApiUrlElimsAnnouncement;

  constructor(
    private noticeService: NoticeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.noticeService.GetNotices().subscribe(notis => {
      this.notisList = notis;
      this.notisList = notis.sort((a, b) => b.id - a.id);
    });
  }


  toggleNotice(notice: Notice): void {
    notice.isShow = !notice.isShow;
    this.updateNotices();
  }


  updateNotices(): void {
    const updatedNotices = this.notisList.map(notice => ({
      id: notice.id,
      isShow: notice.isShow
    }));

    this.noticeService.PutNotice(updatedNotices).subscribe({
      next: () => {
        const selectedNotices = this.notisList.filter(notice => notice.isShow);
        localStorage.setItem('selectedNotices', JSON.stringify(selectedNotices));
      },
      error: (error) => {
        console.error('Error updating notices', error);
      }
    });
  }


  onDelete(notice: Notice): void {
    this.notisList = this.notisList.filter(n => n !== notice);

    this.noticeService.DeleteNotice(notice.id).subscribe({
      next: () => {
        console.log('Notice deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting notice', error);
      }
    });
  }


  navigateToShowNotice(): void {
    this.router.navigate(['/notice']);
  }


  viewFile(notice: Notice, path: string): void {
    if (notice.id) {
      const url = this.baseApiUrlElimsAnnouncement + notice.id + "_" + path;
      window.open(url, "_blank");
    } else {
      console.error('Notice ID is undefined');
    }
  }
}
