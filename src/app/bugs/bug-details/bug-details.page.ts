import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { untilDestroyed } from '@core';
import { BugsService } from '../bugs.service';

import { Bug } from '@shared/models/admin/bugs.model';
import { AddFixComponent } from '../add-fix/add-fix.component';
import { Fix, UPDOWN_VOTES } from '@shared/models/fix.model';

@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.page.html',
  styleUrls: ['./bug-details.page.scss'],
})
export class BugDetailsPage implements OnInit, OnDestroy {
  defaultImage: string = 'assets/images/placeholder.png';
  bug: Bug;

  userData: any;

  constructor(
    private bugService: BugsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    private alertController: AlertController,
    private storage: Storage,
    public toastController: ToastController
  ) {}
  ngOnDestroy(): void {}

  async ngOnInit() {
    this.userData = await this.storage.get('USER');
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('bugid')) {
        this.getBug(+params.get('bugid'));
      } else {
        this.router.navigateByUrl('/tabs/bugs');
      }
    });
  }

  async doRefresh(event: any) {
    await this.getBug(this.bug.id);
    event.target.complete();
  }

  async getBug(id: number) {
    await this.bugService.get(id).subscribe((data: Bug) => {
      this.bug = data[0];
      if (!this.bug.image) this.bug.image = this.defaultImage;
    });
  }

  async updownVote(id: number, isUpvote: boolean) {
    const data: UPDOWN_VOTES = {
      id,
      isUpvote,
    };
    await this.bugService.updownVotesFix(data).subscribe((e) => {
      const bug = this.bug;
      const fix = this.bug.fix.find((e) => e.id == id);
      fix.votes = isUpvote ? fix.votes + 1 : fix.votes - 1;
      this.bug = bug;
    });
  }

  async addFix(bugId: number) {
    console.log(this.userData.id, bugId);
    const modal = await this.modalController.create({
      component: AddFixComponent,
      cssClass: 'addfix--bugs',
      componentProps: {
        data: null,
        action: 'Add',
        extras: {
          id: this.userData.id,
          bugId: bugId,
        },
      },
    });
    await modal.present();
    const {
      data: { data, isSuccess, action },
    } = await modal.onWillDismiss();
    if (data !== null)
      if (isSuccess) {
        await this.getBug(this.bug.id);
        await this.toast('Added');
      } else {
        await this.toast('Failed');
      }
  }

  async edit(item: Fix) {
    const modal = await this.modalController.create({
      component: AddFixComponent,
      cssClass: 'addfix--bugs',
      componentProps: {
        data: item,
        action: 'Edit',
        extras: {
          id: this.userData.id,
          bugId: item.bug_id,
        },
      },
    });
    await modal.present();
    const {
      data: { data, isSuccess, action },
    } = await modal.onWillDismiss();
    if (data !== null)
      if (isSuccess) {
        await this.getBug(this.bug.id);
        await this.toast('Updated');
      } else {
        await this.toast('Failed');
      }
  }

  async delete(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'addedit--delete',
      header: 'Confirm Delete!',
      message: 'Are you sure you want to delete this fix?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Confirm',
          handler: async () => {
            const $fix = this.bugService.deleteFix(id);
            $fix.pipe(untilDestroyed(this)).subscribe(
              async (_data: Fix) => {
                await this.getBug(this.bug.id);
                this.toast('Deleted');
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
}
