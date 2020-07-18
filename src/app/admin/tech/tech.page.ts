import { Component, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from '@core';

import { Tech } from '@shared/models/admin/technologies.model';

import { AdminService } from '../admin.service';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.page.html',
  styleUrls: ['./tech.page.scss'],
})
export class TechPage implements OnInit, OnDestroy {
  techList: Tech[] = [];
  constructor(private adminService: AdminService) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.getTechnologies();
  }

  getTechnologies() {
    const $technologies = this.adminService.getAllTechnologies();
    $technologies.pipe(untilDestroyed(this)).subscribe((data: Tech[]) => {
      this.techList = data;
    });
  }
}
