import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Fix, Votes_Fix, VOTES_POST } from '@shared/models/fix.model';

@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.page.html',
  styleUrls: ['./bug-details.page.scss'],
})
export class BugDetailsPage implements OnInit, OnDestroy {
  defaultImage: string = 'assets/images/placeholder.png';
  bug: Bug;

  isFixed: Boolean = false;

  userData: any;

  constructor(
    private bugService: BugsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    private alertController: AlertController,
    private storage: Storage,
    public toastController: ToastController,
    private cdr: ChangeDetectorRef
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
      this.isFixed = this.bug.is_fixed;
    });
  }

  async updownVote(id: number, is_upvote: boolean) {
    const data: VOTES_POST = {
      is_upvote,
      fix_id: id,
      user_id: this.userData.id,
    };
    await this.bugService.updownVotesFix(data).subscribe((e) => {
      const fix = this.bug.fix.find((b) => b.id == id);
      fix.votes = is_upvote ? fix.votes + 1 : fix.votes - 1;
      this.cdr.detectChanges();
    });
  }

  async addFix(bugId: number) {
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

  private count: number = 0;
  async fixChange() {
    if (this.count == 1) return (this.count = 0);
    const alert = await this.alertController.create({
      cssClass: 'fixed',
      header: 'Confirm Action!',
      message: 'Are you sure you want to change bug fixed status?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.isFixed = !this.isFixed;
            this.count = this.count + 1;
          },
        },
        {
          text: 'Confirm',
          handler: async () => {
            this.bugService
              .update({ id: this.bug.id, is_fixed: this.isFixed } as Bug)
              .subscribe(async (res: Bug) => {
                this.toast('Updated Status');
                await this.getBug(this.bug.id);
              });
            this.count = 0;
          },
        },
      ],
    });

    await alert.present();
  }

  hasUpvoted(fix: Fix): Boolean {
    if (fix.user_id === this.userData.id) return true;
    const vote = fix.votes_fix.find(
      (e: Votes_Fix) => e.user_id == this.userData.id
    );
    if (vote) return vote.is_upvote;
    return false;
  }

  isUpvote(fix: Fix): number {
    const vote = fix.votes_fix.find(
      (e: Votes_Fix) => e.user_id == this.userData.id
    );
    if (vote) return vote.is_upvote ? 1 : 0;
    return -1;
  }

  calcVotes(votes: number) {
    if (!votes) return 0;
    return Math.round(votes);
  }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 2000,
    });
    toast.present();
  }
}
