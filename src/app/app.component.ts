import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  colorMode: string = 'Light';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private authService: AuthService
  ) {
    this.initializeApp();
  }
  async ngOnInit(): Promise<void> {
    const color = await this.storage.get('COLOR_MODE');
    if (color) {
      this.colorMode = color;
    } else {
      this.colorMode = 'Light';
    }
    this.setMode();
    const isLoggedIn = await this.storage.get('EXPIRES_IN');
    console.log('Logged in detected...');
    if (isLoggedIn > Date.now()) {
      this.authService.refreshLogin();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  private setMode() {
    const mode = this.colorMode === 'Light' ? false : true;
    document.body.classList.toggle('dark', mode);
  }
}
