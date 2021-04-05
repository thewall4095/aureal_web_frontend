import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from "./comment.model";
import { HomeDashboardService } from 'src/app/pages/home-dashboard/home-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as FormData from 'form-data';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Output() refresh = new EventEmitter<string>();

  isEditing = false;
  isAddingComment = false;
  isUpvotingComment = false;

  constructor(private homeDashboardService: HomeDashboardService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  replyClick() {
    this.isEditing = !this.isEditing;
  }

  addReply($event){

  }

  upvoteComment(permlink, id){
    this.isUpvotingComment = true;
    let body = new FormData;
    body.append('permlink', permlink);
    body.append('hive_username', localStorage.getItem('hive_username'));
    body.append('comment_id', id);
    body.append('user_id', localStorage.getItem('userId'));
    this.homeDashboardService.upvoteComment(body).subscribe((res:any) =>{
      this.isUpvotingComment = false;
      if(res.msg){
        this.toastr.error("Couldn't upvote !");
      }
    });
  }

  onAdd($event, id) {
    if($event && id){
      this.isAddingComment = true;
      let body = new FormData;
      body.append('user_id', localStorage.getItem('userId'));
      body.append('comment_id', id);
      body.append('text', $event);
      body.append('hive_username', localStorage.getItem('hive_username'));
      this.homeDashboardService.addReply(body).subscribe((res:any) =>{
        this.isAddingComment = false;
        if(res.reply){
          this.refresh.emit("true");
        }else{
          this.toastr.error("Couldn't add comment");

          // const comment: Comment = {
          //   id:123123421,
          //   text: $event,
          //   author: 'Kevin',
          //   votes: 0,
          //   createdAt: '1 min ago'
          // };
          // if(!this.comment.comments) {
          //   this.comment.comments = [];
          // } 
          // this.comment.comments.unshift(comment);
          // this.isEditing = false;
          // this.getComments();
        }
        console.log(res);
      });
    }

  }

}
