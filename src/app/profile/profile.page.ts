import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HTTPS_URL } from '@shared/regex/httpsurl.regex';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  colorMode: string = 'Light';
  userData: User = null;
  HTTPS_URL: RegExp = HTTPS_URL;
  constructor(
    private storage: Storage,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    public toastController: ToastController
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

  updateAvatar(form: NgForm) {
    if (form.valid) {
      this.profileService
        .updateAvatar({
          ...this.userData,
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
}
