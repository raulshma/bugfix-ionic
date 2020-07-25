import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from '@core';
import { Storage } from '@ionic/storage';

import { Country } from '@shared/models/admin/countries.model';

import { AdminService } from '../admin.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss'],
})
export class CountriesPage implements OnInit {
  countriesList: Country[] = [];
  constructor(private storage: Storage) {}

  async ngOnInit(): Promise<void> {
    this.countriesList = await this.getCountries();
  }
  ngOnDestroy(): void {}

  async getCountries(): Promise<Country[]> {
    return await this.storage.get('COUNTRIES');
  }
}
