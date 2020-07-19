import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { PreReleaseTypes } from '@shared/constants/select-items.constants';

import { Version_M } from '@shared/models/admin/versions.model';

import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit {
  myForm: FormGroup;
  releaseTypes = PreReleaseTypes;

  @Input() data: Version_M;
  @Input() action: string;

  private isSuccess: boolean;
  constructor(
    public modalCtrl: ModalController,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  dismiss(res: Version_M = null) {
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
      this.myForm.patchValue({ ...this.data });
    }
  }

  saveForm() {
    if (this.myForm.invalid) {
      this.myForm.updateValueAndValidity();
      return;
    }
    if (this.action === 'Add') {
      this.adminService
        .postVersion(this.myForm.value)
        .subscribe((res: Version_M) => {
          this.isSuccess = true;
          this.dismiss(res);
        });
    } else {
      if (this.myForm.touched && this.myForm.dirty) {
        this.adminService
          .putVersion(this.myForm.value)
          .subscribe((res: number) => {
            this.isSuccess = true;
            this.dismiss(this.myForm.value);
          });
      } else {
        // this.toastr.info('Nothing to update');
      }
    }
  }

  initiateForm(type: string) {
    const form = this.fb.group({
      major: [0, Validators.required],
      minor: [0, Validators.required],
      patch: [0, Validators.required],
      pre_release: [PreReleaseTypes[0].value, Validators.required],
    });
    if (type === 'Edit') {
      form.addControl('id', new FormControl(null, Validators.required));
    }
    return form;
  }
}
