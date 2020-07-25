import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { untilDestroyed } from '@core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Country } from '@shared/models/admin/countries.model';
import { USER_DETAILS } from '@shared/models/profile.model';
import { HTTPS_URL } from '@shared/regex/httpsurl.regex';
import { AdminService } from '../admin/admin.service';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  detailsForm: FormGroup;

  countriesList: Country[] = [];

  defaultImage: string = 'assets/images/placeholder-avatar.png';

  colorMode: string = 'Light';
  userData: User = null;
  HTTPS_URL: RegExp = HTTPS_URL;
  constructor(
    private storage: Storage,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    public toastController: ToastController,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.userData = await this.storage.get('USER');
    if (!this.userData.avatar)
      this.userData.avatar = 'https://i.pravatar.cc/300';
    const color = await this.storage.get('COLOR_MODE');
    if (color) {
      this.colorMode = color;
    } else {
      this.colorMode = 'Light';
    }
    this.countriesList = await this.getCountries();
    this.getUserDetails(this.userData.id);
    this.detailsForm = this.initiateForm();
  }

  getUserDetails(id: number): void {
    const $details = this.profileService.getUser(id);
    $details.pipe(untilDestroyed(this)).subscribe((data: USER_DETAILS) => {
      this.detailsForm.patchValue({
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        country_id: this.countriesList.find((e) => e.id == data.country_id),
      });
    });
  }

  async getCountries(): Promise<Country[]> {
    return await this.storage.get('COUNTRIES');
  }

  async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.remove('EXPIRES_IN');
    await this.storage.remove('USER');
    this.authService.authSubject.next(null);
    this.router.navigateByUrl('login');
  }

  async modeChanged(event: any) {
    await this.storage.set('COLOR_MODE', this.colorMode);
    this.setMode();
  }

  async doRefresh(event: any) {
    await this.ngOnInit();
    event.target.complete();
  }

  updateAvatar(form: NgForm) {
    if (form.valid) {
      this.profileService
        .updateAvatar({
          id: this.userData.id,
          avatar: form.value.avatar,
        })
        .subscribe(
          (res) => {
            this.userData.avatar = form.value.avatar;
            this.storage.set('USER', this.userData);
            this.toast('Avatar Updated');
          },
          (error) => this.toast('Failed to Update Avatar')
        );
    }
  }

  updateDetails() {
    if (this.detailsForm.valid) {
      this.profileService
        .updateDetails({
          id: this.userData.id,
          first_name: this.detailsForm.value.first_name,
          last_name: this.detailsForm.value.last_name,
          country_id: this.detailsForm.value.country_id.id,
        })
        .subscribe(
          (res) => {
            this.toast('Details Updated');
          },
          (error) => this.toast('Failed to Update Details')
        );
    }
  }

  tempUpdate({ avatar }: any) {
    this.userData.avatar = this.HTTPS_URL.test(avatar)
      ? avatar
      : this.userData.avatar;
  }

  private setMode() {
    const mode = this.colorMode === 'Light' ? false : true;
    document.body.classList.toggle('dark', mode);
  }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }
  private initiateForm() {
    return this.fb.group({
      id: this.userData.id,
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      country_id: [Validators.required],
    });
  }

  ngOnDestroy(): void {}
}
