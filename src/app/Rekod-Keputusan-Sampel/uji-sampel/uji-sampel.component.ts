import { Component, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { Sample } from '../../models/sample';
import { ElimsService } from '../../services/elims.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../User/user.service';
import { Staff } from '../../models/staff';
import { K1Detail } from '../../models/k1Detail';
import { RekodKeputusanService } from '../rekod-keputusan.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogCheckoutComponent } from 'src/app/dialogbox/dialog-checkout/dialog-checkout.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-uji-sampel',
  templateUrl: './uji-sampel.component.html',
  styleUrls: ['./uji-sampel.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class UjiSampelComponent {

  columnsToDisplay = [

    'batchId',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'receivedOn',
    'sampleCount',
  ]

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  batches: Batch[] = [];
  samples: Sample[] = [];
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  k1Detail: K1Detail = {} as K1Detail;
  checkAll: boolean = false
  lepassubmit: boolean = false
  statusCodeId: number = 0;
  selectedSamples: Sample[] = [];
  roles: any;
  staffRole: number[];
  customFields: { value: string }[] = [];
  customNo: string = '';
  checkboxClicked: boolean = false;

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private rekodKeputusanService: RekodKeputusanService,
    private dialog: MatDialog,
  ) { }


  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.staff = res;
        this.roleGtacr = true;
        this.staffRole = res.staffRole;
        console.log(this.staffRole);

        this.rekodKeputusanService.GetStaffIdbyStaffRole(4).subscribe(data => {

          this.roles = data.filter(data => data.staffName != null);

          this.roles.sort((a: { staffName: any; }, b: { staffName: any; }) => {
            const roleA = a.staffName;
            const roleB = b.staffName;
            if (roleA < roleB) {
              return -1;
            } else if (roleA > roleB) {
              return 1;
            } else {
              return 0;
            }
          });

        })
      })
    }

    this.statusCodeId = 5;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(data)

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  checkAllChanged() {
    if (this.checkAll) {
      for (let sample of this.samples) {
        sample.checked = true;
      }
      console.log(this.samples);
    } else {
      for (let sample of this.samples) {
        sample.checked = false;
      }
      console.log("All unchecked.");
    }
  }


  checkSingleChanged() {
    this.selectedSamples = [];
    for (const row of this.batches) {
      for (const sample of row.samples) {
        if (sample.checked) {
          this.selectedSamples.push(sample);
        }
      }
    } this.updateCheckoutButtonVisibility();
  }


  updateCheckoutButtonVisibility() {
    if (this.checkboxClicked || this.selectedSamples.length > 0) {
      return true; // Display the Checkout button
    } else {
      return false; // Hide the Checkout button
    }
  }


  displaySelected() {
    this.lepassubmit = true
    this.samples = this.samples.filter(sample => sample.checked);
  }



  checkout() {

    this.k1Detail.inLabBy = this.loginAs;
  

    const dialogRef = this.dialog.open(DialogCheckoutComponent, {
        width: '400px',
        data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result === 'ok') {
            for (const sample of this.selectedSamples) {
                const id = sample.k1DetailId;
                this.rekodKeputusanService.PutCheckout(id, this.k1Detail).subscribe(
                    res => { window.location.reload(); }
                );
            }
        } else if (result === 'cancel') {
            console.log('Cancel clicked');
        }
    });
}



//   checkout() {

//     this.k1Detail.inLabBy = this.loginAs;
//     // Check if Nama Penguji is selected
//     if (!this.k1Detail.inLabBy || this.k1Detail.inLabBy === 'default') {
//         alert('Please select Nama Penguji before proceeding with checkout.');
//         return; // Prevent further execution
//     }

//     const dialogRef = this.dialog.open(DialogCheckoutComponent, {
//         width: '400px',
//         data: {}
//     });

//     dialogRef.afterClosed().subscribe(result => {
//         if (result === 'ok') {
//             for (const sample of this.selectedSamples) {
//                 const id = sample.k1DetailId;
//                 this.rekodKeputusanService.PutCheckout(id, this.k1Detail).subscribe(
//                     res => { window.location.reload(); }
//                 );
//             }
//         } else if (result === 'cancel') {
//             console.log('Cancel clicked');
//         }
//     });
// }



  addField() {
    this.customFields.push({ value: '' });
  }


  searchByCustomNos() {

    this.updateCheckoutButtonVisibility();

    // Concatenate the current customNo with customFields values
    const customNos = [this.customNo, ...this.customFields.map(field => field.value)];
    // Remove duplicates by converting to Set and then back to array
    const uniqueCustomNos = [...new Set(customNos)];

    // Clear previous results
    this.selectedSamples = [];

    // Perform search for each unique custom number
    uniqueCustomNos.forEach(customNo => {
      this.elimsService.GetElimsSamplesByCustomNo(customNo).subscribe(res => {
        console.log(res);
        this.selectedSamples.push(...res.filter(sample => sample.statusCodeId === 5));
      });
    });
  }

  
  addFieldIfEmpty(index: number = -1) {
    if (index === -1) {
      // Check if the first field is empty
      if (this.customNo.trim() !== '' && this.customFields.length === 0) {
        // Add a new field
        this.customFields.push({ value: '' });
      }
    } else {
      // Check if the current field is not the last field and is not empty
      if (index === this.customFields.length - 1 && this.customFields[index].value.trim() !== '') {
        // Add a new field if the last field is not empty
        this.customFields.push({ value: '' });
      }
    }
  }

}



