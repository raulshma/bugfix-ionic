import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Bug } from '@shared/models/admin/bugs.model';
import { Tech } from '@shared/models/admin/technologies.model';
import { Version_M } from '@shared/models/admin/versions.model';

import { untilDestroyed } from '@core';
import { AdminService } from '../admin/admin.service';
import { BugsService } from './bugs.service';

import { AddEditBugsComponent } from './add-edit/add-edit.component';
import { Votes_Bug, VOTES_POST_BUG } from '@shared/models/fix.model';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.page.html',
  styleUrls: ['./bugs.page.scss'],
})
export class BugsPage implements OnInit, OnDestroy {
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
    this.getTechs();
    this.getBugs();
    this.getVersions();
  }

  async getTechs() {
    return await this.adminService
      .getAllTechnologies()
      .subscribe((data: Tech[]) => {
        this.tech = data;
        this.tech.unshift({ id: -1, name: 'CLEAR SELECTION' });
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

  async updownVote(id: number, is_upvote: boolean) {
    const data: VOTES_POST_BUG = {
      is_upvote,
      bug_id: id,
      user_id: this.userData.id,
    };
    await this.bugService.updownVotesBug(data).subscribe((e) => {
      const bug = this.bugs.find((b) => b.id == id);
      bug.votes = is_upvote ? bug.votes + 1 : bug.votes - 1;
      this.cdr.detectChanges();
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
          tech: this.tech.slice(1, this.tech.length - 2),
          versions: this.versions,
        },
      },
    });
    await modal.present();
    const {
      data: { data, isSuccess, action },
    } = await modal.onWillDismiss();
    if (data !== null)
      if (isSuccess) {
        await this.bugService.getAll().subscribe((data: Bug[]) => {
          this.bugs = data;
          this.filteredBugs = [...this.bugs];
        });
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
          tech: this.tech.slice(1, this.tech.length - 2),
          versions: this.versions,
        },
      },
    });
    await modal.present();
    const {
      data: { data, isSuccess, action },
    } = await modal.onWillDismiss();
    if (data !== null)
      if (isSuccess) {
        await this.getBugs();
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

  async doRefresh(event: any) {
    await Promise.all([this.getBugs(), this.getVersions()]).then((e) => {
      event.target.complete();
    });
  }

  hasUpvoted(bug: Bug): Boolean {
    if (bug.user_id === this.userData.id) return true;
    const vote = bug.votes_bug.find(
      (e: Votes_Bug) => e.user_id == this.userData.id
    );
    if (vote) return vote.is_upvote;
    return false;
  }

  isUpvote(bug: Bug): number {
    const vote = bug.votes_bug.find(
      (e: Votes_Bug) => e.user_id == this.userData.id
    );
    if (vote) return vote.is_upvote ? 1 : 0;
    return -1;
  }

  calcVotes(votes: number) {
    if (!votes) return 0;
    return Math.round(votes);
  }

  filterChanged(value: Tech) {
    if (value.id === -1) {
      this.filteredBugs = this.bugs;
      this.isFiltered = false;
      this.filterValue = null;
    } else {
      this.filteredBugs = this.bugs.filter(
        (bug: Bug) => bug.tech_id === value.id
      );
      this.isFiltered = false;
    }
  }
}
