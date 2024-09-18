import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CetakLabelComponent } from './Cetak-Label/cetak-label/cetak-label.component';
import { DaftarSampelComponent } from './Daftar-Sampel/daftar-sampel/daftar-sampel.component';
import { HomeComponent } from './General/home/home.component';
import { SuntingSampelComponent } from './Daftar-Sampel/sunting-sampel/sunting-sampel.component';
import { UlangCetakLabelComponent } from './Cetak-Label/ulang-cetak-label/ulang-cetak-label.component';
import { HantarSampelComponent } from './Hantar-Sampel/hantar-sampel/hantar-sampel.component';
import { KeputusanUjianComponent } from './KeputusanUjian/keputusan-ujian/keputusan-ujian.component';
import { ViewSampleComponent } from './Daftar-Sampel/view-sample/view-sample.component';
import { TarikhSampelDihantarComponent } from './Hantar-Sampel/tarikh-sampel-dihantar/tarikh-sampel-dihantar.component';
import { DaftarSampelSMKComponent } from './Daftar-Sampel/daftar-sampel-smk/daftar-sampel-smk.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { ElimsSenaraiSampelComponent } from './Daftar-Sampel/elims-senarai-sampel/elims-senarai-sampel.component';
import { RegisterComponent } from './General/register/register.component';
import { ProfileComponent } from './User/profile/profile.component';
import { FormProfileComponent } from './User/form-profile/form-profile.component';
import { MemoComponent } from './Hantar-Sampel/memo/memo.component';
import { ViewKeputusanUjianComponent } from './KeputusanUjian/view-keputusan-ujian/view-keputusan-ujian.component';
import { PrintMemoComponent } from './print-memo/print-memo.component';
import { DaftarTerimaSampelComponent } from './Daftar Terima Sampel/daftar-terima-sampel/daftar-terima-sampel.component';
import { CetakLembaranKerjaComponent } from './CetakWorksheet/cetak-lembaran-kerja/cetak-lembaran-kerja.component';
import { SuratIringanComponent } from './Hantar-Sampel/surat-iringan/surat-iringan.component';
import { LampiranComponent } from './Hantar-Sampel/lampiran/lampiran.component';
import { CetakWorksheetComponent } from './CetakWorksheet/cetak-worksheet/cetak-worksheet.component';
import { UlangCetakLembaranKerjaComponent } from './CetakWorksheet/ulang-cetak-lembaran-kerja/ulang-cetak-lembaran-kerja.component';
import { UjiSampelComponent } from './Rekod-Keputusan-Sampel/uji-sampel/uji-sampel.component';
import { RekodKeputusanComponent } from './Rekod-Keputusan-Sampel/rekod-keputusan/rekod-keputusan.component';
import { SahKeputusanComponent } from './Rekod-Keputusan-Sampel/sah-keputusan/sah-keputusan.component';
import { CetakKeputusanComponent } from './CetakKeputusan/cetak-keputusan/cetak-keputusan.component';
import { PosKeputusanComponent } from './CetakKeputusan/pos-keputusan/pos-keputusan.component';
import { RekodKelulusanComponent } from './Kelulusan/rekod-kelulusan/rekod-kelulusan.component';
import { PdfCetakKeputusanComponent } from './CetakKeputusan/pdf-cetak-keputusan/pdf-cetak-keputusan.component';
import { SampelSimpananLgmComponent } from './Kelulusan/sampel-simpanan-lgm/sampel-simpanan-lgm.component';
import { PdfCetakKeputusanUipComponent } from './CetakKeputusan/pdf-cetak-keputusan-uip/pdf-cetak-keputusan-uip.component';
import { KeputusanUjianPelulusComponent } from './KeputusanUjian/keputusan-ujian-pelulus/keputusan-ujian-pelulus.component';
import { UlangKeputusanUjianComponent } from './KeputusanUjian/ulang-keputusan-ujian/ulang-keputusan-ujian.component';
import { LaporanBilSampelComponent } from './Laporan/laporan-bil-sampel/laporan-bil-sampel.component';
import { LaporanPengujiComponent } from './Laporan/laporan-penguji/laporan-penguji.component';
import { LaporanStatistikComponent } from './Laporan/laporan-statistik/laporan-statistik.component';
import { LaporanKuantitiComponent } from './Laporan/laporan-kuantiti/laporan-kuantiti.component';
import { LaporanTahapKecekapanComponent } from './Laporan/laporan-tahap-kecekapan/laporan-tahap-kecekapan.component';
import { LaporanKgkComponent } from './Laporan/laporan-kgk/laporan-kgk.component';
import { TarikhTerimaSampelComponent } from './Daftar Terima Sampel/tarikh-terima-sampel/tarikh-terima-sampel.component';
import { LaporanBilHariComponent } from './Laporan/laporan-bil-hari/laporan-bil-hari.component';
import { NoticeComponent } from './Notis/notice/notice.component';
import { ViewNoticeComponent } from './Notis/view-notice/view-notice.component';
import { ShowNoticeComponent } from './Notis/show-notice/show-notice.component';



const routes: Routes = [
  {
    path: "Elims", component: HomeComponent, pathMatch: "full"
  },


  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },


  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'sample',
    component: ElimsSenaraiSampelComponent, canActivate: [AuthGuardService], data: { roles: ['1', '2', '3'] }
  },

  {
    path: 'daftar-sampel',
    component: DaftarSampelComponent, canActivate: [AuthGuardService]
  },

  {
    // path: 'sample/edit/:k1DetailId',
    path: 'sample/edit',
    component: SuntingSampelComponent, canActivate: [AuthGuardService], data: { roles: ['1', '2', '3'] }
  },

  {
    path: 'cetak-label',
    component: CetakLabelComponent, canActivate: [AuthGuardService], data: { roles: ['1', '2', '3'] }
  },

  {
    path: 'ulang-cetak-label',
    component: UlangCetakLabelComponent, canActivate: [AuthGuardService], data: { roles: ['1', '2', '3'] }
  },


  {
    path: 'hantar-sampel',
    component: HantarSampelComponent, canActivate: [AuthGuardService], data: { roles: ['1', '2', '3'] }
  },

  {
    path: 'keputusan-ujian',
    component: KeputusanUjianComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    // path: 'sample/view-sample/:k1DetailId',
    path: 'sample/view-sample',
    component: ViewSampleComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    // path: 'sample/view-keputusan-ujian/:k1DetailId',
    path: 'keputusan-ujian/view-keputusan-ujian',
    component: ViewKeputusanUjianComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },


  {
    path: 'tarikh-sampel-dihantar',
    component: TarikhSampelDihantarComponent, canActivate: [AuthGuardService],data: { roles: ['1', '2','3'] }
  },

  {
    path: 'daftar-sampel-smk',
    component: DaftarSampelSMKComponent, canActivate: [AuthGuardService], data: { roles: ['1', '2', '3'] }
  },

  {
    path: 'tarikh-sampel-dihantar/:batchId',
    component: TarikhSampelDihantarComponent, canActivate: [AuthGuardService], data: { roles: ['1', '2', '3'] }
  },

  {
    path: 'profile',
    component: ProfileComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    path: 'form-profile',
    component: FormProfileComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  // {
  //   path: 'memo/:unit/:batchId',
  //   component: MemoComponent
  // },

  {
    path: 'memo/:batchId',
    component: MemoComponent, canActivate: [AuthGuardService], data: { roles: ['2', '4'] }
  },

  // {
  //   path: 'memo/:batchId/:staffId',
  //   component: MemoComponent
  // },

  // {
  //   path: 'print-memo/:batchId/:staffId',
  //   component: PrintMemoComponent
  // },

  {
    path: 'print-memo/:batchId',
    component: PrintMemoComponent
  },

  //route GTACR
  {
    path: 'daftar-terima-sampel',
    component: DaftarTerimaSampelComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'daftar-terima-sampel/:batchId',
    component: DaftarTerimaSampelComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'cetak-lembaran-kerja',
    component: CetakLembaranKerjaComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },


  {
    path: 'surat-iringan',
    component: SuratIringanComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    path: 'lampiran',
    component: LampiranComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    path: 'lampiran/:batchId',
    component: LampiranComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    path: 'surat-iringan/:batchId',
    component: SuratIringanComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    path: 'cetak-keputusan/:batchId',
    component: PdfCetakKeputusanComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    path: 'cetak-lembaran-kerja/cetak-worksheet/:k1DetailId',
    component: CetakWorksheetComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },


  {
    path: 'ulang-cetak-lembaran-kerja',
    component: UlangCetakLembaranKerjaComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'surat-iringan/:batchId/:username',
    component: SuratIringanComponent, canActivate: [AuthGuardService], data: { roles: ['*'] }
  },

  {
    path: 'uji-sampel',
    component: UjiSampelComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'rekod-keputusan',
    component: RekodKeputusanComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },


  {
    path: 'sah-keputusan',
    component: SahKeputusanComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'cetak-worksheet',
    component: CetakWorksheetComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'cetak-keputusan',
    component: CetakKeputusanComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },


  {
    path: 'pos-keputusan',
    component: PosKeputusanComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },


  {
    path: 'rekod-kelulusan',
    component: RekodKelulusanComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'detail-keputusan',
    component: CetakKeputusanComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'pdf-cetak-keputusan',
    component: PdfCetakKeputusanComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'sampel-simpanan-lgm',
    component: SampelSimpananLgmComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'pdf-cetak-keputusan-uip',
    component: PdfCetakKeputusanUipComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'keputusan-ujian-pelulus',
    component: KeputusanUjianPelulusComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'ulang-keputusan-ujian',
    component: UlangKeputusanUjianComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },



  {
    path: 'laporan-bil-sampel',
    component: LaporanBilSampelComponent, canActivate: [AuthGuardService], data: { roles: ['4', '2'] }
  },

  {
    path: 'laporan-penguji',
    component: LaporanPengujiComponent, canActivate: [AuthGuardService], data: { roles: ['4', '2'] }
  },

  {
    path: 'laporan-statistik',
    component: LaporanStatistikComponent, canActivate: [AuthGuardService], data: { roles: ['4', '2'] }
  },

  {
    path: 'laporan-kuantiti',
    component: LaporanKuantitiComponent, canActivate: [AuthGuardService], data: { roles: ['4', '2'] }
  },

  {
    path: 'laporan-tahap-kecekapan',
    component: LaporanTahapKecekapanComponent, canActivate: [AuthGuardService], data: { roles: ['4', '2'] }
  },

  {
    path: 'laporan-kgk',
    component: LaporanKgkComponent, canActivate: [AuthGuardService], data: { roles: ['4', '2'] }
  },

  {
    path: 'tarikh-terima-sampel',
    component: TarikhTerimaSampelComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'laporan-bil-hari',
    component: LaporanBilHariComponent, canActivate: [AuthGuardService], data: { roles: ['4', '2'] }
  },

  {
    path: 'notice',
    component: NoticeComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'view-notice',
    component: ViewNoticeComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },

  {
    path: 'show-notice',
    component: ShowNoticeComponent, canActivate: [AuthGuardService], data: { roles: ['4'] }
  },
  { path: 'show-notice/:id', component: ShowNoticeComponent }, // New route


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
