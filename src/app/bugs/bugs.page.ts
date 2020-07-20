import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Bug } from '@shared/models/admin/bugs.model';
import { Tech } from '@shared/models/admin/technologies.model';

import { AdminService } from '../admin/admin.service';
import { BugsService } from './bugs.service';

import { AddEditBugsComponent } from './add-edit/add-edit.component';
import { Version_M } from '@shared/models/admin/versions.model';
import { untilDestroyed } from '@core';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.page.html',
  styleUrls: ['./bugs.page.scss'],
})
export class BugsPage implements OnInit, OnDestroy {
  isLoading: boolean = true;

  isFiltered: boolean = false;
  filterValue: any;

  userData: any;

  tech: Tech[];
  bugs: Bug[];
  versions: Version_M[];

  filteredBugs: Bug[];

  constructor(
    private cdr: ChangeDetectorRef,
    private bugService: BugsService,
    private adminService: AdminService,
    public modalController: ModalController,
    public alertController: AlertController,
    public toastController: ToastController,
    private storage: Storage
  ) {}
  ngOnDestroy(): void {}

  async ngOnInit(): Promise<void> {
    this.userData = await this.storage.get('USER');
    Promise.all([this.getTechs(), this.getBugs(), this.getVersions()]).then(
      (e) => {
        this.isLoading = false;
      }
    );
  }

  async getTechs() {
    return await this.adminService
      .getAllTechnologies()
      .subscribe((data: Tech[]) => {
        this.tech = data;
      });
  }

  async getBugs() {
    return await this.bugService.getAll().subscribe((data: Bug[]) => {
      this.bugs = data;
      this.filteredBugs = this.bugs;
    });
  }
  async getVersions() {
    return await this.adminService
      .getAllVersions()
      .subscribe((data: Version_M[]) => {
        this.versions = data;
      });
  }
  async add() {
    const modal = await this.modalController.create({
      component: AddEditBugsComponent,
      cssClass: 'addedit--bugs',
      componentProps: {
        data: null,
        action: 'Add',
        extras: {
          id: this.userData.id,
          tech: this.tech,
          versions: this.versions,
        },
      },
    });
    await modal.present();
    const {
      data: { data, isSuccess, action },
    } = await modal.onWillDismiss();
    if (isSuccess) {
      this.filteredBugs.push(data);
      this.filteredBugs = [...this.filteredBugs];
      await this.toast('Added');
    } else {
      await this.toast('Failed');
    }
  }

  async edit(item: Bug) {
    const modal = await this.modalController.create({
      component: AddEditBugsComponent,
      cssClass: 'addedit--bugs',
      componentProps: {
        data: item,
        action: 'Edit',
        extras: {
          id: this.userData.id,
          tech: this.tech,
          versions: this.versions,
        },
      },
    });
    await modal.present();
    const {
      data: { data, isSuccess, action },
    } = await modal.onWillDismiss();
    if (isSuccess) {
      const idx = this.filteredBugs.findIndex((e) => e.id === data.id);
      this.filteredBugs[idx] = data;
      this.filteredBugs = [...this.filteredBugs];
      await this.toast('Updated');
    } else {
      await this.toast('Failed');
    }
  }

  async delete(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'addedit--delete',
      header: 'Confirm Delete!',
      message: 'Are you sure you want to delete this bug?',
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
            const $versions = this.bugService.delete(id);
            $versions.pipe(untilDestroyed(this)).subscribe(
              (_data: Bug) => {
                const idx = this.filteredBugs.findIndex((e) => e.id === id);
                this.filteredBugs.splice(idx, 1);
                this.toast('Deleted');
                this.filteredBugs = [...this.filteredBugs];
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

  filterChanged(value: number) {
    if (value === undefined) {
      this.filteredBugs = this.bugs;
      this.isFiltered = false;
    } else {
      this.filteredBugs = this.bugs.filter((bug: Bug) => bug.tech_id === value);
      this.isFiltered = false;
    }
  }
}
