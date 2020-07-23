import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';

import { untilDestroyed } from '@core';

import { Version_M } from '@shared/models/admin/versions.model';

import { AdminService } from '../admin.service';
import { AddEditVersionsComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.page.html',
  styleUrls: ['./versions.page.scss'],
})
export class VersionsPage implements OnInit, OnDestroy {
  versionList: Version_M[] = [];

  constructor(
    private adminService: AdminService,
    public modalController: ModalController,
    public alertController: AlertController,
    public toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.getVersions();
  }
  ngOnDestroy(): void {}

  async add() {
    const modal = await this.modalController.create({
      component: AddEditVersionsComponent,
      cssClass: 'addedit--versions',
      componentProps: { data: null, action: 'Add' },
    });
    await modal.present();
    const {
      data: { data, isSuccess, action },
    } = await modal.onWillDismiss();
    if (isSuccess) {
      this.versionList.push(data);
      this.versionList = [...this.versionList];
      await this.toast('Added');
    } else {
      await this.toast('Failed');
    }
  }

  async edit(item: Version_M) {
    const modal = await this.modalController.create({
      component: AddEditVersionsComponent,
      cssClass: 'addedit--versions',
      componentProps: { data: item, action: 'Edit' },
    });
    await modal.present();
    const {
      data: { data, isSuccess, action },
    } = await modal.onWillDismiss();
    if (isSuccess) {
      const idx = this.versionList.findIndex((e) => e.id === data.id);
      this.versionList[idx] = data;
      this.versionList = [...this.versionList];
      await this.toast('Updated');
    } else {
      await this.toast('Failed');
    }
  }

  async delete(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'addedit--delete',
      header: 'Confirm Delete!',
      message: 'Are you sure you want to delete this version?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Confirm',
          handler: () => {
            const $versions = this.adminService.deleteVersion(id);
            $versions.pipe(untilDestroyed(this)).subscribe(
              (_data: number) => {
                const idx = this.versionList.findIndex((e) => e.id === id);
                this.versionList.splice(idx, 1);
                this.toast('Deleted');
                this.versionList = [...this.versionList];
              },
              async (error) => await this.toast('Failed')
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 2000,
    });
    toast.present();
  }

  getVersions() {
    const $versions = this.adminService.getAllVersions();
    $versions.pipe(untilDestroyed(this)).subscribe((data: Version_M[]) => {
      this.versionList = data;
    });
  }
}
