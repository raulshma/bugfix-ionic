import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Bug } from '@shared/models/admin/bugs.model';
import { Tech } from '@shared/models/admin/technologies.model';
import { Version_M } from '@shared/models/admin/versions.model';

import { BugsService } from '../bugs.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditBugsComponent implements OnInit {
  myForm: FormGroup;

  @Input() data: Bug;
  @Input() extras: { id: number; tech: Tech[]; versions: Version_M[] };
  @Input() action: string;

  private isSuccess: boolean;
  constructor(
    public modalCtrl: ModalController,
    private bugsService: BugsService,
    private fb: FormBuilder
  ) {}

  dismiss(res: Bug = null) {
    let data = {
      action: this.action,
      isSuccess: this.isSuccess,
      data: res,
    };
    this.modalCtrl.dismiss(data);
  }

  ngOnInit(): void {
    this.myForm = this.initiateForm(this.action);
    if (this.action === 'Edit') {
      const tech_id = this.extras.tech.find((e) => e.id === this.data.tech_id);
      this.myForm.patchValue({ ...this.data, tech_id });
    }
  }

  saveForm() {
    if (this.myForm.invalid) {
      this.myForm.updateValueAndValidity();
      return;
    }
    const formValue = this.myForm.value;
    formValue.tech_id = formValue.tech_id.id;
    if (this.action === 'Add') {
      this.bugsService.post(formValue).subscribe((res: Bug) => {
        this.isSuccess = true;
        this.dismiss(res);
      });
    } else {
      if (this.myForm.touched && this.myForm.dirty) {
        this.bugsService.update(formValue).subscribe((res: Bug) => {
          this.isSuccess = true;
          this.dismiss(formValue);
        });
      } else {
        // this.toastr.info('Nothing to update');
      }
    }
  }

  initiateForm(type: string) {
    const form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tech_id: [null, Validators.required],
      version_id: [null, Validators.required],
      is_fixed: [false],
      image: [''],
      user_id: [this.extras.id],
    });
    if (type === 'Edit') {
      form.addControl('id', new FormControl(null, Validators.required));
    }
    return form;
  }
}
