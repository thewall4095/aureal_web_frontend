import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { environment } from 'src/environments/environment';
import {CommonService} from 'src/app/services/common.service';
import { FormControl } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize, switchAll } from 'rxjs/operators';
import { CreateCommunityComponent } from 'src/app/components/create-community/create-community.component';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-select-community',
  templateUrl: './select-community.component.html',
  styleUrls: ['./select-community.component.scss']
})
export class SelectCommunityComponent implements OnInit {
  episodeId;
  currentCommunities;
  searchInput = new FormControl();
  searchResults;
  isLoading: Boolean = false;
  isbuttonLoaderOn: Boolean = false;
  constructor(public dialogRef: MatDialogRef<SelectCommunityComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public commonService: CommonService, public dialog: MatDialog, private confirmationDialogService: ConfirmationDialogService, private toastr: ToastrService) {
    this.episodeId = this.data.episodeId;
  }

  ngOnInit(): void {

    // this.commonService.searchCommunity('super').subscribe((res: any) => {
    //   console.log(res);
    //   this.searchResults = res.allCommunity;
    // });
    this.getCurrentCommunity();

    this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.searchResults = [];
          this.isLoading = true;
        }),
        switchMap(value => this.commonService.searchCommunity(value)
          .pipe(
            finalize(() => {
            }),
          )
        )
      )
      .subscribe((data: any) => {
        console.log('heerererere', data.allCommunity);
        this.isLoading = false;
        this.searchResults = data.allCommunity;
      })
  }

  clearInput() {
    this.searchInput.setValue('');
  }

  getCurrentCommunity() {
    this.isbuttonLoaderOn = true;
    this.commonService.getEpisodeCommunity(this.episodeId).subscribe((res: any) => {
      this.currentCommunities = res.allCommunity;
      console.log(res);
      this.isbuttonLoaderOn = false;
    });
  }

  addToSelectedCommunity(community) {
    this.isbuttonLoaderOn = true;
    let body = new FormData;
    body.append('community_id', community.id);
    body.append('episode_id', this.episodeId);
    body.append('user_id', localStorage.getItem('userId'));
    this.commonService.assignCommunity(body).subscribe((res: any) => {
      if (res.msg) {
        this.confirmationDialogService.confirm('Please confirm..', res.msg + '\n Proceed to follow and continue adding episode to community.', 'Proceed', 'Cancel')
          .then((confirmed) => {
            console.log('User confirmed:', confirmed);
            let body1 = new FormData;
            body1.append('community_id', community.id);
            body1.append('user_id', localStorage.getItem('userId'));
            this.commonService.subscribeCommunity(body1).subscribe((res: any) => {
              if (res.msg) {
                this.toastr.error(res.msg);
              } else {
                this.addToSelectedCommunity(community);
              }
            });
          })
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
      } else {
        this.isbuttonLoaderOn = false;
        this.getCurrentCommunity();
      }
    })
  }

  removeCommunity(community) {
    this.isbuttonLoaderOn = true;
    let body = new FormData;
    body.append('community_id', community.id);
    body.append('episode_id', this.episodeId);
    body.append('user_id', localStorage.getItem('userId'));
    this.commonService.removeCommunity(body).subscribe((res: any) => {
      this.isbuttonLoaderOn = false;
      this.getCurrentCommunity();
    })
  }

  closeDialogRef() {
    this.dialogRef.close();
  }

  createCommunity() {
    this.closeDialogRef();
    this.dialog.open(CreateCommunityComponent, {
      width: '400px',
      height: '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
    });
  }
}
