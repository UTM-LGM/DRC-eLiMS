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
import { ViewKeputusanUjianComponent } from './view-keputusan-ujian/view-keputusan-ujian.component';
import { PrintMemoComponent } from './print-memo/print-memo.component';
import { DaftarTerimaSampelComponent } from './daftar-terima-sampel/daftar-terima-sampel.component';
import { CetakLembaranKerjaComponent } from './CetakWorksheet/cetak-lembaran-kerja/cetak-lembaran-kerja.component';
import { SampelBelumTerimaComponent } from './sampel-belum-terima/sampel-belum-terima.component';
import { SuratIringanComponent } from './surat-iringan/surat-iringan.component';
import { LampiranComponent } from './Hantar-Sampel/lampiran/lampiran.component';
import { CetakWorksheetComponent } from './CetakWorksheet/cetak-worksheet/cetak-worksheet.component';
import { UlangCetakLembaranKerjaComponent } from './CetakWorksheet/ulang-cetak-lembaran-kerja/ulang-cetak-lembaran-kerja.component';
import { UjiSampelComponent } from './Rekod-Keputusan-Sampel/uji-sampel/uji-sampel.component';
import { RekodKeputusanComponent } from './Rekod-Keputusan-Sampel/rekod-keputusan/rekod-keputusan.component';
import { SahKeputusanComponent } from './Rekod-Keputusan-Sampel/sah-keputusan/sah-keputusan.component';
import { CetakKeputusanComponent } from './CetakKeputusan/cetak-keputusan/cetak-keputusan.component';
import { CetakSuratKeputusanComponent } from './CetakKeputusan/cetak-surat-keputusan/cetak-surat-keputusan.component';
import { PosKeputusanComponent } from './CetakKeputusan/pos-keputusan/pos-keputusan.component';
import { RekodKelulusanComponent } from './Kelulusan/rekod-kelulusan/rekod-kelulusan.component';
import { PdfCetakKeputusanComponent } from './pdf-cetak-keputusan/pdf-cetak-keputusan.component';
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
import { TarikhTerimaSampelComponent } from './Daftar-Sampel/tarikh-terima-sampel/tarikh-terima-sampel.component';
import { LaporanBilHariComponent } from './Laporan/laporan-bil-hari/laporan-bil-hari.component';
import { CetakComponent } from './cetak/cetak.component';



const routes: Routes = [
  {
    path: "Elims", component: HomeComponent, pathMatch: "full"
  },


  {
    path: 'home',
    component: HomeComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'sample',
    component: ElimsSenaraiSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'daftar-sampel',
    component: DaftarSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'sample/edit/:k1DetailId',
    component: SuntingSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'cetak-label',
    component: CetakLabelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'ulang-cetak-label',
    component: UlangCetakLabelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'ulang-cetak-label',
    component: UlangCetakLabelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'hantar-sampel',
    component: HantarSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'keputusan-ujian',
    component: KeputusanUjianComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'sample/view-sample/:k1DetailId',
    component: ViewSampleComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'sample/view-keputusan-ujian/:k1DetailId',
    component: ViewKeputusanUjianComponent, canActivate: [AuthGuardService]
  },


  {
    path: 'tarikh-sampel-dihantar',
    component: TarikhSampelDihantarComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'daftar-sampel-smk',
    component: DaftarSampelSMKComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'tarikh-sampel-dihantar/:batchId',
    component: TarikhSampelDihantarComponent
  },

  {
    path: 'profile',
    component: ProfileComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'form-profile',
    component: FormProfileComponent, canActivate: [AuthGuardService]
  },

  // {
  //   path: 'memo/:unit/:batchId',
  //   component: MemoComponent
  // },

  {
    path: 'memo/:batchId',
    component: MemoComponent, canActivate: [AuthGuardService]
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
    component: PrintMemoComponent, canActivate: [AuthGuardService]
  },

  //route GTACR
  {
    path: 'daftar-terima-sampel',
    component: DaftarTerimaSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'daftar-terima-sampel/:batchId',
    component: DaftarTerimaSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'sampel-belum-terima/:batchId/',
    component: SampelBelumTerimaComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'cetak-lembaran-kerja',
    component: CetakLembaranKerjaComponent, canActivate: [AuthGuardService]
  },


  {
    path: 'surat-iringan',
    component: SuratIringanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'lampiran',
    component: LampiranComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'lampiran/:batchId',
    component: LampiranComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'surat-iringan/:batchId',
    component: SuratIringanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'cetak-lembaran-kerja/cetak-worksheet/:k1DetailId',
    component: CetakWorksheetComponent, canActivate: [AuthGuardService]
  },


  {
    path: 'ulang-cetak-lembaran-kerja',
    component: UlangCetakLembaranKerjaComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'surat-iringan/:batchId/:username',
    component: SuratIringanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'uji-sampel',
    component: UjiSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'rekod-keputusan',
    component: RekodKeputusanComponent, canActivate: [AuthGuardService]
  },


  {
    path: 'sah-keputusan',
    component: SahKeputusanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'cetak-worksheet',
    component: CetakWorksheetComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'cetak-keputusan',
    component: CetakKeputusanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'cetak-surat-keputusan',
    component: CetakSuratKeputusanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'pos-keputusan',
    component: PosKeputusanComponent, canActivate: [AuthGuardService]
  },


  {
    path: 'rekod-kelulusan',
    component: RekodKelulusanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'detail-keputusan',
    component: CetakKeputusanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'pdf-cetak-keputusan',
    component: PdfCetakKeputusanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'sampel-simpanan-lgm',
    component: SampelSimpananLgmComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'pdf-cetak-keputusan-uip',
    component: PdfCetakKeputusanUipComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'keputusan-ujian-pelulus',
    component: KeputusanUjianPelulusComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'ulang-keputusan-ujian',
    component: UlangKeputusanUjianComponent, canActivate: [AuthGuardService]
  },



  {
    path: 'laporan-bil-sampel',
    component: LaporanBilSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'laporan-penguji',
    component: LaporanPengujiComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'laporan-statistik',
    component: LaporanStatistikComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'laporan-kuantiti',
    component: LaporanKuantitiComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'laporan-tahap-kecekapan',
    component: LaporanTahapKecekapanComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'laporan-kgk',
    component: LaporanKgkComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'tarikh-terima-sampel',
    component: TarikhTerimaSampelComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'laporan-bil-hari',
    component: LaporanBilHariComponent, canActivate: [AuthGuardService]
  },

  {
    path: 'cetak-keputusan/cetak',
    component: CetakComponent, canActivate: [AuthGuardService]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
