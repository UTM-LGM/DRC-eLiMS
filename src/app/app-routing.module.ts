import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CetakLabelComponent } from './Cetak-Label/cetak-label/cetak-label.component';
import { DaftarSampelComponent } from './Daftar-Sampel/daftar-sampel/daftar-sampel.component';
import { HomeComponent } from './General/home/home.component';
import { SuntingSampelComponent } from './Daftar-Sampel/sunting-sampel/sunting-sampel.component';
import { UlangCetakLabelComponent } from './Cetak-Label/ulang-cetak-label/ulang-cetak-label.component';
import { HantarSampelComponent } from './Hantar-Sampel/hantar-sampel/hantar-sampel.component';
import { KeputusanUjianComponent } from './keputusan-ujian/keputusan-ujian.component';
import { ViewSampleComponent } from './Daftar-Sampel/view-sample/view-sample.component';
import { TarikhSampelDihantarComponent } from './Hantar-Sampel/tarikh-sampel-dihantar/tarikh-sampel-dihantar.component';
import { DaftarSampelSMKComponent } from './Daftar-Sampel/daftar-sampel-smk/daftar-sampel-smk.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { ElimsSenaraiSampelComponent } from './Daftar-Sampel/elims-senarai-sampel/elims-senarai-sampel.component';
import { RegisterComponent } from './General/register/register.component';
import { LaporanComponent } from './laporan/laporan.component';
import { ProfileComponent } from './User/profile/profile.component';
import { FormProfileComponent } from './User/form-profile/form-profile.component';
import { MemoComponent } from './Hantar-Sampel/memo/memo.component';
import { ViewKeputusanUjianComponent } from './view-keputusan-ujian/view-keputusan-ujian.component';
import { PrintMemoComponent } from './print-memo/print-memo.component';
import { DaftarTerimaSampelComponent } from './daftar-terima-sampel/daftar-terima-sampel.component';
import { CetakLembaranKerjaComponent } from './CetakWorksheet/cetak-lembaran-kerja/cetak-lembaran-kerja.component';
import { SampelBelumTerimaComponent } from './sampel-belum-terima/sampel-belum-terima.component';
import { ViewMaklumatPenghantaranComponent } from './view-maklumat-penghantaran/view-maklumat-penghantaran.component';
import { SuratIringanComponent } from './surat-iringan/surat-iringan.component';
import { LampiranComponent } from './Hantar-Sampel/lampiran/lampiran.component';
import { CetakWorksheetComponent } from './cetak-worksheet/cetak-worksheet.component';
import { UlangCetakLembaranKerjaComponent } from './CetakWorksheet/ulang-cetak-lembaran-kerja/ulang-cetak-lembaran-kerja.component';



const routes: Routes = [
  {
    path : "Elims", component:HomeComponent, pathMatch: "full"
  },

  
  {
    path:'home',
    component: HomeComponent, canActivate:[AuthGuardService]
  },

  {
    path:'register',
    component: RegisterComponent
  },

  {
    path:'sample',
    component: ElimsSenaraiSampelComponent, canActivate:[AuthGuardService]
  },

  {
    path:'daftar-sampel',
    component: DaftarSampelComponent, canActivate:[AuthGuardService]
  },

  {
    path:'sample/edit/:k1DetailId',
    component: SuntingSampelComponent, canActivate:[AuthGuardService]
  },

  {
    path:'cetak-label',
    component: CetakLabelComponent, canActivate:[AuthGuardService]
  },
  
  {
    path:'ulang-cetak-label',
    component: UlangCetakLabelComponent, canActivate:[AuthGuardService]
  },

  {
    path:'ulang-cetak-label',
    component: UlangCetakLabelComponent, canActivate:[AuthGuardService]
  },

  {
    path:'hantar-sampel',
    component: HantarSampelComponent, canActivate:[AuthGuardService]
  },

  {
    path:'keputusan-ujian',
    component: KeputusanUjianComponent, canActivate:[AuthGuardService]
  },

  {
    path:'sample/view-sample/:k1DetailId',
    component: ViewSampleComponent, canActivate:[AuthGuardService]
  },

  {
    path:'sample/view-keputusan-ujian/:k1DetailId',
    component: ViewKeputusanUjianComponent, canActivate:[AuthGuardService]
  },


  {
    path:'tarikh-sampel-dihantar',
    component: TarikhSampelDihantarComponent, canActivate:[AuthGuardService]
  },

  {
    path:'daftar-sampel-smk',
    component: DaftarSampelSMKComponent, canActivate:[AuthGuardService]
  },

  {
    path: 'tarikh-sampel-dihantar/:batchId',
    component: TarikhSampelDihantarComponent
  },

  {
    path: 'laporan',
    component: LaporanComponent, canActivate:[AuthGuardService]
  },

  {
    path: 'profile',
    component: ProfileComponent, canActivate:[AuthGuardService]
  },

  {
    path: 'form-profile',
    component: FormProfileComponent, canActivate:[AuthGuardService]
  },

  // {
  //   path: 'memo/:unit/:batchId',
  //   component: MemoComponent
  // },

  {
    path: 'memo/:batchId',
    component: MemoComponent
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
    component: DaftarTerimaSampelComponent
  },

  {
    path: 'daftar-terima-sampel/:batchId',
    component: DaftarTerimaSampelComponent
  },

  {
    path: 'sampel-belum-terima/:batchId/',
    component: SampelBelumTerimaComponent
  },

  {
    path: 'cetak-lembaran-kerja',
    component: CetakLembaranKerjaComponent
  },
  

  {
    path: 'surat-iringan',
    component: SuratIringanComponent
  },

  {
    path: 'lampiran',
    component: LampiranComponent
  },

  {
    path: 'lampiran/:batchId',
    component: LampiranComponent
  },

  {
    path: 'surat-iringan/:batchId',
    component: SuratIringanComponent
  },


  {
    path: 'cetak-worksheet/:k1DetailId',
    component: CetakWorksheetComponent
  },

  
  {
    path: 'ulang-cetak-lembaran-kerja',
    component: UlangCetakLembaranKerjaComponent
  },

  {
    path: 'surat-iringan/:batchId/:username',
    component: SuratIringanComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
