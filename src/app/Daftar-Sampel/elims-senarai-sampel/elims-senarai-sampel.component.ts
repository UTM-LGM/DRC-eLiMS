import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { K1Detail } from 'src/app/models/k1Detail';
import { Sample } from 'src/app/models/sample';
import { userDTO } from 'src/app/models/userDTO';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DrclimstrainingService } from 'src/app/services/drclimstraining.service';
import { ElimsService } from 'src/app/services/elims.service';
import { GetahBongkahService } from 'src/app/services/getah-bongkah.service';
import { DaftarSampelService } from '../daftar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DataDeleteComponent } from 'src/app/dialogbox/data-delete/data-delete.component';

@Component({
  selector: 'app-elims-senarai-sampel',
  templateUrl: './elims-senarai-sampel.component.html',
  styleUrls: ['./elims-senarai-sampel.component.css']
})
export class ElimsSenaraiSampelComponent implements OnInit {

  showSmk: boolean = false
  @ViewChild('pdfContent') pdfContent: ElementRef;

  displayedColumns: string[] = [
    'k1DetailId',
    'customNo',
    'importedDate',
    'quantity',
    'importerName',
    'samplePropose',
    'action'
  ];

  dataSource!: MatTableDataSource<K1Detail>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  user: userDTO = {} as userDTO
  sample: Sample = {} as Sample;
  samples: Sample[] = [];
  k1Details: any
  k1Header: any
  sampleDetails: any;
  loginAs: any;
  roleId: any
  companyName: any
  userFiltered: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private elimsService: ElimsService,
    private router: Router,
    private authservice: AuthService,
    private drclimstrainingService: DrclimstrainingService,
    private getahBongkahService: GetahBongkahService,
    private daftarSampelService: DaftarSampelService,
    private userService: UserService,
    private dialog: MatDialog,

  ) { }

  ngOnInit() {

    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.roleId = this.authservice.getSessionRole()
    }
    else {
      this.loginAs = '';
    }
    if (this.roleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.getElimsSamplesByUsername()
      })
    }
    else if (this.roleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authservice.changeUser(res);
        this.user = res
        this.getElimsSamplesByUsername()
      })
    }
  }

  getElimsSamplesByUsername() {
    console.log(this.user.username)
    this.elimsService.GetElimsSamplesByUsername(this.user.username, 1).subscribe(data => {
      console.log(data)
      this.k1Details = data;
      this.dataSource = new MatTableDataSource<K1Detail>(this.k1Details);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteSample(k1DetailId: number, rubberType: string): void {
    console.log(k1DetailId, "   ", rubberType)
    const dialogRef = this.dialog.open(DataDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.daftarSampelService.DeleteElimsSample(k1DetailId).subscribe({
          next: () => { },
        });
        if (rubberType == "Getah Bongkah") {
          this.getahBongkahService.DeleteBRSample(k1DetailId).subscribe({
            next: () => {
              alert('Sampel telah dipadam!');
              this.ngOnInit()
            },
          });
        } else if (rubberType == "Lateks") {
          this.drclimstrainingService.DeleteLtxSample(k1DetailId).subscribe({
            next: () => {
              alert('Sampel telah dipadam!');
              this.ngOnInit()
            },
          });
        }

      }
    });
  }

  printSample(k1HeaderId: number) {
    this.router.navigate(['sample/print/' + k1HeaderId])
  }

  viewSample(k1DetailId: number) {
    this.router.navigate(['sample/view-sample/' + k1DetailId])
  }

  updateSampleElims(k1HeaderId: number) {
    console.log(k1HeaderId);
    this.router.navigate(['sample/edit/' + k1HeaderId]);
  }

  updateSample(k1DetailId: number) {
    console.log(k1DetailId);
    this.router.navigate(['sample/edit/' + k1DetailId]);
  }

  updateSampleBR(k1HeaderId: number) {
    console.log(k1HeaderId);
    this.router.navigate(['sample/edit/' + k1HeaderId]);
  }

}