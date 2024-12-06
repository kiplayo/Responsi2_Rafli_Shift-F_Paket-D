import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.page.html',
  styleUrls: ['./mahasiswa.page.scss'],
})
export class MahasiswaPage implements OnInit {
  dataMahasiswa: any;

  constructor(private api: ApiService, private modal: ModalController, private alertCtrl: AlertController, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.getMahasiswa();
  }

  getMahasiswa() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataMahasiswa = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  modalTambah: any;
  id: any;
  nama: any;
  deskripsi: any;

  resetModal() {
    this.id = null;
    this.nama = '';
    this.deskripsi = '';
  }

  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }
  
  cancel() {
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  tambahMahasiswa() {
    if (this.nama != '' && this.deskripsi != '') {
      let data = {
        nama: this.nama,
        deskripsi: this.deskripsi,
      }
      this.api.tambah(data, 'tambah.php')
        .subscribe({
          next: (hasil: any) => {
            this.resetModal();
            console.log('berhasil tambah pahlawan');
            this.getMahasiswa();
            this.modalTambah = false;
            this.modal.dismiss();
          },
          error: (err: any) => {
            console.log('gagal tambah');
          }
        })
    } else {
      console.log('gagal tambah karena masih ada data yg kosong');
    }
  }

  async confirmHapusMahasiswa(id: any) {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus data ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Hapus dibatalkan');
          },
        },
        {
          text: 'Hapus',
          handler: () => {
            this.hapusMahasiswa(id);
          },
        },
      ],
    });

    await alert.present();
  }

  hapusMahasiswa(id: any) {
    this.api.hapus(id, 'hapus.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getMahasiswa();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });
  }

  ambilMahasiswa(id: any) {
    this.api.lihat(id,
      'lihat.php?id=').subscribe({
        next: (hasil: any) => {
          console.log('sukses', hasil);
          let mahasiswa = hasil;
          this.id = mahasiswa.id;
          this.nama = mahasiswa.nama;
          this.deskripsi = mahasiswa.deskripsi;
        },
        error: (error: any) => {
          console.log('gagal ambil data');
        }
      })
  }
  modalEdit: any;

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilMahasiswa(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }

  editMahasiswa() {
    let data = {
      id: this.id,
      nama: this.nama,
      deskripsi: this.deskripsi
    }
    this.api.edit(data, 'edit.php')
      .subscribe({
        next: (hasil: any) => {
          console.log(hasil);
          this.resetModal();
          this.getMahasiswa();
          console.log('berhasil edit Mahasiswa');
          this.modalEdit = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal edit Mahasiswa');
        }
      })
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
  
}