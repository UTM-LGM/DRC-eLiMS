import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../notice.service';
import { environment } from 'src/app/environments/environment';
import { Notice } from 'src/app/models/notice';

@Component({
  selector: 'app-show-notice',
  templateUrl: './show-notice.component.html',
  styleUrls: ['./show-notice.component.css']
})
export class ShowNoticeComponent implements OnInit {

  selectedNotice: Notice[] = [];
  baseApiUrlElimsAnnouncement = environment.baseApiUrlElimsAnnouncement;

  constructor(private noticeService: NoticeService) { }

  ngOnInit(): void {
    this.noticeService.GetSelectedNotices().subscribe(data => {
      // Sort notices by id in descending order
      this.selectedNotice = data.sort((a, b) => b.id - a.id);
    });
  }

  viewFile(notice: Notice, path: string): void {
    console.log('Notice Object:', notice);
    if (notice.id) {
      const url = this.baseApiUrlElimsAnnouncement + notice.id + "_" + path;
      window.open(url, "_blank");
    } else {
      console.error('Notice ID is undefined');
    }
  }
}
