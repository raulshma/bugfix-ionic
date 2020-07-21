import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BugsService } from '../bugs.service';

import { Bug } from '@shared/models/admin/bugs.model';

@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.page.html',
  styleUrls: ['./bug-details.page.scss'],
})
export class BugDetailsPage implements OnInit {
  defaultImage: string = 'assets/images/placeholder.jpg';
  bug: Bug;

  constructor(
    private bugService: BugsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('bugid')) {
        this.getBug(+params.get('bugid'));
      } else {
        this.router.navigateByUrl('/tabs/bugs');
      }
    });
  }

  async getBug(id: number) {
    return await this.bugService.get(id).subscribe((data: Bug) => {
      this.bug = data[0];
    });
  }
}
