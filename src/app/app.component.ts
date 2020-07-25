import { Component, OnDestroy, OnInit } from '@angular/core';

import { IonRouterOutlet, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth/auth.service';
import { AdminService } from './admin/admin.service';
import { untilDestroyed } from '@core';
import { Country } from '@shared/models/admin/countries.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  colorMode: string = 'Light';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    this.initializeApp();
  }
  ngOnDestroy(): void {}
  async ngOnInit(): Promise<void> {
    const isLoggedIn = await this.storage.get('EXPIRES_IN');
    console.log('Logged in detected...');
    if (isLoggedIn > Date.now()) {
      this.authService.refreshLogin();
    }
    const color = await this.storage.get('COLOR_MODE');
    if (color) {
      this.colorMode = color;
    } else {
      this.colorMode = 'Light';
    }
    this.setMode();
    await this.getCountries();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  private async getCountries(): Promise<void> {
    if (!(await this.storage.get('COUNTRIES'))) {
      const $countries = this.adminService.getAllCountries();
      $countries
        .pipe(untilDestroyed(this))
        .subscribe(async (data: Country[]) => {
          await this.storage.set('COUNTRIES', data);
        });
    }
  }
  private setMode() {
    const mode = this.colorMode === 'Light' ? false : true;
    document.body.classList.toggle('dark', mode);
  }
}
