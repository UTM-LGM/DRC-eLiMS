import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../notice.service';

@Component({
  selector: 'app-show-notice',
  templateUrl: './show-notice.component.html',
  styleUrls: ['./show-notice.component.css']
})
export class ShowNoticeComponent implements OnInit {

  selectedNotice: any[] = [];


  constructor(
    private noticeService: NoticeService,
  ) { }


  ngOnInit(): void {
    this.noticeService.GetSelectedNotices().subscribe(data => {
      // Sort notices by id in descending order
      this.selectedNotice = data.sort((a, b) => b.id - a.id);
    });
  }

}
