import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { K1Detail } from 'src/app/models/k1Detail';
import { userDTO } from 'src/app/models/userDTO';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ElimsService } from 'src/app/services/elims.service';
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
  k1Details: any
  loginAs: any;
  userRoleId: any
  roleForwarder: boolean;
  roleUip: boolean;
  roleImporter: boolean;
  selectedRowData: any;
  selectedK1DetailId: number;
  
  constructor(
    private elimsService: ElimsService,
    private router: Router,
    private authservice: AuthService,
    private daftarSampelService: DaftarSampelService,
    private userService: UserService,
    private dialog: MatDialog,

  ) { }

  ngOnInit() {

    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.userRoleId = this.authservice.getSessionRole()
    }
    else {
      this.loginAs = '';
    }
    if (this.userRoleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
        this.roleImporter = false
        this.getElimsSamplesByUsername()

      })
    }
    else if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authservice.changeUser(res);
        this.user = res
        this.roleImporter = true
        this.roleForwarder = false
        this.roleUip = false
        this.getElimsSamplesByUsername()
      })
    }
    else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = false
        this.roleUip = true
        this.roleImporter = false
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
    console.log(k1DetailId, "   ", rubberType);
    const dialogRef = this.dialog.open(DataDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.daftarSampelService.DeleteElimsSample(k1DetailId).subscribe({
          next: () => {

            this.dataSource.data = this.dataSource.data.filter((item: any) => item.k1DetailId !== k1DetailId);
  
            console.log(`k1Detail with ID ${k1DetailId} deleted successfully.`);

           },
          error: (error) => {
            console.error('Error deleting sample from Elims table:', error);
          }
        });

      }
    });
  }


  viewSample(k1DetailId: number) {
    // this.router.navigate(['sample/view-sample/' + k1DetailId]);
    this.daftarSampelService.setSelectedK1DetailId(k1DetailId);
    this.router.navigate(['sample/view-sample']); 

  }


  updateSample(k1DetailId: number) {
    // console.log(k1DetailId);
    // this.router.navigate(['sample/edit/' + k1DetailId]);
    this.daftarSampelService.setSelectedK1DetailId(k1DetailId);
    this.router.navigate(['sample/edit']); 
  }

}