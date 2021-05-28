import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { environment } from 'src/environments/environment';
import {CommonService} from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.scss']
})
export class CreateCommunityComponent implements OnInit {
  createCommunityForm: FormGroup;
  isbuttonLoaderOn: Boolean = false;
  constructor(public dialogRef: MatDialogRef<CreateCommunityComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public commonService: CommonService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.createCommunityForm = new FormGroup({
      'community_name': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required]),
    });
  }

  onSubmitLink(data) {
    let body = new FormData;
    body.append('community_name', data.community_name);
    body.append('description', data.description);
    body.append('user_id', localStorage.getItem('userId'));
    this.isbuttonLoaderOn = true;
    this.commonService.createCommunity(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;

      if (res.msg) {
        this.toastr.error(res.msg);
      } else {
        this.toastr.success('Community Created');
        this.dialogRef.close();
      }
    });
  }


  getErrorCommunityName(form) {
    return form.get('community_name').hasError('required') ? 'Field is required' : '';
  }

  getErrorCommunityDescription(form) {
    return form.get('description').hasError('required') ? 'Field is required' : '';
  }

}
