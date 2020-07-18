import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

import * as _ from 'lodash';

import { VALIDATE_EMAIL } from '@shared/regex/email.regex';
import { VALIDATE_REGISTER_PASSWORD } from '@shared/regex/password.regex';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public validateEmail: RegExp = VALIDATE_EMAIL;
  public validatePassword: RegExp = VALIDATE_REGISTER_PASSWORD;

  constructor(
    private authService: AuthService,
    private router: Router,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) this.router.navigateByUrl('');
  }

  register(form) {
    this.authService.register(form.value).subscribe(
      (res) => {
        this.router.navigateByUrl('');
      },
      async (error) => {
        await this.failed(error.error.message);
      }
    );
  }

  async failed(message: string) {
    const toast = await this.toastController.create({
      message: `${_.upperFirst(message)}`,
      duration: 2000,
    });
    toast.present();
  }
}
