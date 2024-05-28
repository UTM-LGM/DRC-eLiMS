import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeMs from '@angular/common/locales/ms';



import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DaftarSampelComponent } from './Daftar-Sampel/daftar-sampel/daftar-sampel.component';
import { SuntingSampelComponent } from './Daftar-Sampel/sunting-sampel/sunting-sampel.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SidenavComponent } from './General/sidenav/sidenav.component';
import { NgMaterialMultilevelMenuModule, MultilevelMenuService, } from 'ng-material-multilevel-menu';
import { CommonModule, DecimalPipe } from '@angular/common';
import { UlangCetakLabelComponent } from './Cetak-Label/ulang-cetak-label/ulang-cetak-label.component';
import { CetakLabelComponent } from './Cetak-Label/cetak-label/cetak-label.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HomeComponent } from './General/home/home.component';
import { HantarSampelComponent } from './Hantar-Sampel/hantar-sampel/hantar-sampel.component';
import { KeputusanUjianComponent } from './KeputusanUjian/keputusan-ujian/keputusan-ujian.component';
import { LoginComponent } from './login/login.component';
import { ToolbarComponent } from './General/toolbar/toolbar.component';
import { ViewSampleComponent } from './Daftar-Sampel/view-sample/view-sample.component';
import { TarikhSampelDihantarComponent } from './Hantar-Sampel/tarikh-sampel-dihantar/tarikh-sampel-dihantar.component';
import { CommaNumberDirective } from './comma-number.directive';
import { RegisterComponent } from './General/register/register.component';
import { DaftarSampelSMKComponent } from './Daftar-Sampel/daftar-sampel-smk/daftar-sampel-smk.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrModule } from 'ngx-toastr';
import { LoginForwarderComponent } from './login-forwarder/login-forwarder.component';
import { ElimsSenaraiSampelComponent } from './Daftar-Sampel/elims-senarai-sampel/elims-senarai-sampel.component';
import { DialogDaftarSampelComponent } from './dialogbox/dialog-daftar-sampel/dialog-daftar-sampel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileComponent } from './User/profile/profile.component';
import { FormProfileComponent } from './User/form-profile/form-profile.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MemoComponent } from './Hantar-Sampel/memo/memo.component';
import { BorangUka7Component } from './Hantar-Sampel/borang-uka7/borang-uka7.component';
import { DataDeleteComponent } from './dialogbox/data-delete/data-delete.component';
import { ViewKeputusanUjianComponent } from './view-keputusan-ujian/view-keputusan-ujian.component';
import { SpinnerComponent } from './dialogbox/spinner/spinner.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrintMemoComponent } from './print-memo/print-memo.component';
import { DaftarTerimaSampelComponent } from './daftar-terima-sampel/daftar-terima-sampel.component';
import { SampelBelumTerimaComponent } from './sampel-belum-terima/sampel-belum-terima.component';
import { CetakLembaranKerjaComponent } from './CetakWorksheet/cetak-lembaran-kerja/cetak-lembaran-kerja.component';
import { ViewMaklumatPenghantaranComponent } from './view-maklumat-penghantaran/view-maklumat-penghantaran.component';
import { SuratIringanComponent } from './surat-iringan/surat-iringan.component';
import { LampiranComponent } from './Hantar-Sampel/lampiran/lampiran.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { GroupByPipe } from './pipes/group-by.pipe';
import { CetakWorksheetComponent } from './CetakWorksheet/cetak-worksheet/cetak-worksheet.component';
import { SajarahPenghantaranComponent } from './sajarah-penghantaran/sajarah-penghantaran.component';
import { MaklumatPenghantaranComponent } from './maklumat-penghantaran/maklumat-penghantaran.component';
import { UlangCetakLembaranKerjaComponent } from './CetakWorksheet/ulang-cetak-lembaran-kerja/ulang-cetak-lembaran-kerja.component';
import { UjiSampelComponent } from './Rekod-Keputusan-Sampel/uji-sampel/uji-sampel.component';
import { RekodKeputusanComponent } from './Rekod-Keputusan-Sampel/rekod-keputusan/rekod-keputusan.component';
import { SahKeputusanComponent } from './Rekod-Keputusan-Sampel/sah-keputusan/sah-keputusan.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PdfWorksheetBRComponent } from './CetakWorksheet/pdf-worksheet-br/pdf-worksheet-br.component';
import { PdfWorksheetLtxComponent } from './CetakWorksheet/pdf-worksheet-ltx/pdf-worksheet-ltx.component';
import { CetakKeputusanComponent } from './CetakKeputusan/cetak-keputusan/cetak-keputusan.component';
import { CetakSuratKeputusanComponent } from './CetakKeputusan/cetak-surat-keputusan/cetak-surat-keputusan.component';
import { PosKeputusanComponent } from './CetakKeputusan/pos-keputusan/pos-keputusan.component';
import { RekodKelulusanComponent } from './Kelulusan/rekod-kelulusan/rekod-kelulusan.component';
import { DetailKeputusanComponent } from './detail-keputusan/detail-keputusan.component';
import { PdfCetakKeputusanComponent } from './pdf-cetak-keputusan/pdf-cetak-keputusan.component';
import { PdfCetakSuratKeputusanComponent } from './pdf-cetak-surat-keputusan/pdf-cetak-surat-keputusan.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DialogCheckoutComponent } from './dialogbox/dialog-checkout/dialog-checkout.component';
import { SampelSimpananLgmComponent } from './Kelulusan/sampel-simpanan-lgm/sampel-simpanan-lgm.component';
import { PdfCetakKeputusanUipComponent } from './pdf-cetak-keputusan-uip/pdf-cetak-keputusan-uip.component';
import { KeputusanUjianPelulusComponent } from './KeputusanUjian/keputusan-ujian-pelulus/keputusan-ujian-pelulus.component';
import { UlangKeputusanUjianComponent } from './KeputusanUjian/ulang-keputusan-ujian/ulang-keputusan-ujian.component';
import { LaporanBilSampelComponent } from './Laporan/laporan-bil-sampel/laporan-bil-sampel.component';
import { LaporanPengujiComponent } from './Laporan/laporan-penguji/laporan-penguji.component';
import { LaporanStatistikComponent } from './Laporan/laporan-statistik/laporan-statistik.component';
import { LaporanKuantitiComponent } from './Laporan/laporan-kuantiti/laporan-kuantiti.component';
import { LaporanTahapKecekapanComponent } from './Laporan/laporan-tahap-kecekapan/laporan-tahap-kecekapan.component';
import { LaporanKgkComponent } from './Laporan/laporan-kgk/laporan-kgk.component';
import { DeliveryDateNotUpdatedComponent } from './CetakKeputusan/delivery-date-not-updated/delivery-date-not-updated.component';
import { DeliveryUpdatedComponent } from './CetakKeputusan/delivery-updated/delivery-updated.component';
import { TarikhTerimaSampelComponent } from './Daftar-Sampel/tarikh-terima-sampel/tarikh-terima-sampel.component';
import { LaporanBilHariComponent } from './Laporan/laporan-bil-hari/laporan-bil-hari.component';


// import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    DaftarSampelComponent,
    SuntingSampelComponent,
    SidenavComponent,
    UlangCetakLabelComponent,
    CetakLabelComponent,
    HomeComponent,
    HantarSampelComponent,
    KeputusanUjianComponent,
    LoginComponent,
    ToolbarComponent,
    ViewSampleComponent,
    TarikhSampelDihantarComponent,
    CommaNumberDirective,
    RegisterComponent,
    DaftarSampelSMKComponent,
    LoginForwarderComponent,
    ElimsSenaraiSampelComponent,
    DialogDaftarSampelComponent,
    ProfileComponent,
    FormProfileComponent,
    MemoComponent,
    BorangUka7Component,
    DataDeleteComponent,
    ViewKeputusanUjianComponent,
    SpinnerComponent,
    PrintMemoComponent,
    DaftarTerimaSampelComponent,
    SampelBelumTerimaComponent,
    CetakLembaranKerjaComponent,
    ViewMaklumatPenghantaranComponent,
    SuratIringanComponent,
    LampiranComponent,
    GroupByPipe,
    CetakWorksheetComponent,
    SajarahPenghantaranComponent,
    MaklumatPenghantaranComponent,
    UlangCetakLembaranKerjaComponent,
    UjiSampelComponent,
    RekodKeputusanComponent,
    SahKeputusanComponent,
    PdfWorksheetBRComponent,
    PdfWorksheetLtxComponent,
    CetakKeputusanComponent,
    CetakSuratKeputusanComponent,
    PosKeputusanComponent,
    RekodKelulusanComponent,
    DetailKeputusanComponent,
    PdfCetakKeputusanComponent,
    PdfCetakSuratKeputusanComponent,
    DialogCheckoutComponent,
    SampelSimpananLgmComponent,
    PdfCetakKeputusanUipComponent,
    KeputusanUjianPelulusComponent,
    UlangKeputusanUjianComponent,
    LaporanBilSampelComponent,
    LaporanPengujiComponent,
    LaporanStatistikComponent,
    LaporanKuantitiComponent,
    LaporanTahapKecekapanComponent,
    LaporanKgkComponent,
    DeliveryDateNotUpdatedComponent,
    DeliveryUpdatedComponent,
    TarikhTerimaSampelComponent,
    LaporanBilHariComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    NgMaterialMultilevelMenuModule,
    CommonModule,
    MatCheckboxModule,
    MatTabsModule,
    ToastrModule.forRoot(), // Add this line
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxPaginationModule,
    QRCodeModule,
    MatSnackBarModule
    // DaftarTerimaSampelComponent,
    // SampelBelumTerimaComponent,
  ],
  providers: [MultilevelMenuService, DecimalPipe, { provide: LOCALE_ID, useValue: 'ms' }],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
    registerLocaleData(localeMs);
  }

 }
