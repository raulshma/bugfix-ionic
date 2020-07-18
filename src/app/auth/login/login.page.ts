import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

import { VALIDATE_EMAIL } from '@shared/regex/email.regex';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public validateEmail: RegExp = VALIDATE_EMAIL;

  constructor(
    private authService: AuthService,
    private router: Router,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) this.router.navigateByUrl('');
  }

  login(form) {
    this.authService.login(form.value).subscribe(
      (res) => {
        this.router.navigateByUrl('');
      },
      async (error) => await this.failed()
    );
  }

  async failed() {
    const toast = await this.toastController.create({
      message: 'Failed to login, try again.',
      duration: 2000,
    });
    toast.present();
  }
}
