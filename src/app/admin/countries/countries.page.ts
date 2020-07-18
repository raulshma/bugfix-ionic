import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from '@core';

import { Country } from '@shared/models/admin/countries.model';

import { AdminService } from '../admin.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss'],
})
export class CountriesPage implements OnInit {
  countriesList: Country[] = [];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getCountries();
  }
  ngOnDestroy(): void {}

  getCountries() {
    const $countries = this.adminService.getAllCountries();
    $countries.pipe(untilDestroyed(this)).subscribe((data: Country[]) => {
      this.countriesList = data;
    });
  }
}
