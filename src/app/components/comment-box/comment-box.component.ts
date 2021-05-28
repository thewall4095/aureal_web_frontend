import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from "@angular/router";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnInit {
  @Output() add = new EventEmitter<string>();
  @Input() isLoading: Boolean = false;

  value: string;
  constructor(public router: Router, public authService: AuthService, private toastr: ToastrService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  post() {
    if (this.value.trim()) {
      if (!this.authService.isAuthenticated()) {
        // this.router.navigateByUrl('/auth');
        this.openHiveAuthDialog(true);
      } else {
        if (!this.authService.isHiveConnected()) {
          this.openHiveAuthDialog(true);
        } else {
          this.add.emit(this.value);
          this.value = '';
        }
      }
    }
  }

  openHiveAuthDialog(autoCheck: Boolean): void {
    this.dialog.open(HiveAuthComponent, {
      width: '800px',
      // height:  '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { autoCheck: autoCheck }
    });
  }

}
