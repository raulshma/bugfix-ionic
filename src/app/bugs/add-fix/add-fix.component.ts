import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Fix } from '@shared/models/fix.model';

import { BugsService } from '../bugs.service';

@Component({
  selector: 'app-add-fix',
  templateUrl: './add-fix.component.html',
  styleUrls: ['./add-fix.component.scss'],
})
export class AddFixComponent implements OnInit {
  myForm: FormGroup;

  @Input() data: Fix;
  @Input() extras: { id: number; bugId: number };
  @Input() action: string;

  private isSuccess: boolean;
  constructor(
    public modalCtrl: ModalController,
    private bugsService: BugsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.myForm = this.initiateForm(this.action);
    if (this.action === 'Edit') {
      this.myForm.patchValue(this.data);
    }
  }

  saveForm() {
    if (this.myForm.invalid) {
      this.myForm.updateValueAndValidity();
      return;
    }
    if (this.action === 'Add') {
      this.bugsService.postFix(this.myForm.value).subscribe((res: Fix) => {
        this.isSuccess = true;
        this.dismiss(res);
      });
    } else {
      if (this.myForm.touched && this.myForm.dirty) {
        this.bugsService.updateFix(this.myForm.value).subscribe((res: Fix) => {
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
      title: ['', Validators.required],
      description: ['', Validators.required],
      user_id: [this.extras.id, Validators.required],
      bug_id: [this.extras.bugId, Validators.required],
      votes: [0],
      image: [''],
    });
    if (type === 'Edit') {
      form.addControl('id', new FormControl(null, Validators.required));
    }
    return form;
  }

  dismiss(res: Fix = null) {
    let data = {
      action: this.action,
      isSuccess: this.isSuccess,
      data: res,
    };
    this.modalCtrl.dismiss(data);
  }
}
