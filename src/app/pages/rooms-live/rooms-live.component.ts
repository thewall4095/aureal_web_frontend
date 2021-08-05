import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
declare var JitsiMeetExternalAPI: any;
import { WebsocketService } from 'src/app/services/websocket.service';
import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-rooms-live',
  templateUrl: './rooms-live.component.html',
  styleUrls: ['./rooms-live.component.scss'],
  providers: [WebsocketService]
})
export class RoomsLiveComponent implements OnInit, AfterViewInit {
  roomId;
  roomData;
  toHide: Boolean = true;
  ///
  domain: string = "sessions.aureal.one"; // For self hosted use your domain
  room: any;
  options: any;
  api: any;
  user: any;

  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;
  ///
  timerr;

  ///chat
  chatText = '';
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public roomsService: RoomsService,
    private router: Router,
    public userDetailsService: UserDetailsService,
    public websocketService: WebsocketService
  ) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.roomId = paramMap.get('room_id');
    });
    //setInterval(this.checkIfHostJoined(), 2000);
  }

  ngOnInit(): void {
    this.websocketService.connect(this.roomId);
    let body = new FormData;
    body.append('roomid', this.roomId);
    this.roomsService.getRoomDetails(body).subscribe((res:any) => {
      this.roomData = res.data;
      this.userDetailsService.getUserDetails(localStorage.getItem('userId')).then((res: any) => {
        console.log(res);
        this.roomData['joinerData'] = res.users;
        if(this.roomData.hostuserid == this.roomData.joinerData.id){
          body.append('userid', localStorage.getItem('userId'));
          this.roomsService.hostJoined(body).subscribe((res:any) => {
            this.renderRoom(true);
          });
        }else{
          if(this.roomData.isactive){
            //  this.renderRoom(false);
          }else{
            this.timerr ? this.timerr.clearInterval() : '';
            this.timerr = setInterval(()=>{
              this.checkIfHostJoined();
            },5000);
          }
        }
        // this.userDetailsService.UserDetails = res.users;
      });
    });
  }

  // liveData$ = this.websocketService.messages$.pipe(
  //   map((rows:any) => {
  //     console.log(rows.data);
  //   }),
  //   catchError(error => { throw error }),
  //   tap({
  //     error: error => console.log('[Live component] Error:', error),
  //     complete: () => console.log('[Live component] Connection Closed')
  //   })
  // );

  renderRoom(isHost){
    this.timerr ? this.timerr.clearInterval() : '';

    this.options = {
      roomName: this.roomData.roomid,
      // width: 900,
      // height: 500,
      configOverwrite: { 
        subject: this.roomData.title,
        prejoinPageEnabled: false,
        startAudioOnly: true,
        startWithAudioMuted: true,
        hideLobbyButton: true,
        enableWelcomePage: false,
        disableShortcuts: true,
        disableProfile: true,
        disableJoinLeaveSounds: true,
        toolbarButtons: [
          'microphone', 
          'closedcaptions',
          'fodeviceselection', 'hangup',
          'livestreaming',
          'tileview',
          'mute-everyone', 
          'recording',
          // 'localrecording'
        ],
        localRecording: {
          enabled: true,
          format: 'wav'
        }
     },
      interfaceConfigOverwrite: {
        APP_NAME: 'Aureal Rooms',
        CONNECTION_INDICATOR_DISABLED: true,
        DEFAULT_BACKGROUND: '#222222',
        DEFAULT_REMOTE_DISPLAY_NAME: 'Pro Aureal',
        HIDE_INVITE_MORE_HEADER: true,
        JITSI_WATERMARK_LINK: 'https://aureal.one',
        LOCAL_THUMBNAIL_RATIO: 1, 
        MOBILE_APP_PROMO: false,
        SUPPORT_URL: 'https://discord.com/invite/wMEsxnXBZk',
          // overwrite interface properties
      },
      parentNode: document.querySelector('#aureal-iframe'),
      userInfo: {
          displayName: this.roomData.joinerData.username,
          avatarUrl: this.roomData.joinerData.img,
          // participantId: this.roomData.joinerData.id
      }
    }
    if(!isHost){
      this.options.configOverwrite.toolbarButtons = [
        'microphone', 
        'closedcaptions',
        'fodeviceselection', 'hangup',
        'raisehand',
        'tileview',
      ];
    }
    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
    this.api.executeCommand('avatarUrl', this.roomData.joinerData.img);
    // Event handlers
    this.api.addEventListeners({
        readyToClose: this.handleClose,
        participantLeft: this.handleParticipantLeft,
        participantJoined: this.handleParticipantJoined,
        videoConferenceJoined: this.handleVideoConferenceJoined,
        videoConferenceLeft: this.handleVideoConferenceLeft,
        audioMuteStatusChanged: this.handleMuteStatus,
        videoMuteStatusChanged: this.handleVideoStatus,
        chatUpdated: this.handlechatUpdated,
        incomingMessage: this.handleIncomingMessage,
        outgoingMessage: this.handleOutgoingMessage,
        endpointTextMessageReceived: this.handleEndpointTextMessageReceived
    });
    this.toHide = false;
  }

  ngAfterViewInit(): void {

  }


  handleClose = () => {
    console.log("handleClose");
  }

  checkIfHostJoined(){
    this.ngOnInit();
    // this.renderRoom();
  }

  sendtest(){
    console.log('sent');
    this.websocketService.sendMessage('testtesttestmessagefromclient');
  }

  async checkAllParticipants(){
    let data:any;
    data = await this.getParticipants();
    console.log(data);
    // // if(!data && this.roomData.hostuserid == this.roomData.joinerData.id){
    // //   this.toHide = false;
    // // }else if(data && data[0]){
    // //   // this.executeCommand('hangup');
    // //   this.toHide = false;
    // // }
    // // debugger
    // if(data && data.length && this.roomData.hostuserid == this.roomData.joinerData.id && data[0].displayName == this.roomData.joinerData.username){
    //   this.toHide = false;
    //   // this.timerr.clearInterval();
    // }else if(data && data[0] && data[1] && this.roomData.hostuserid != this.roomData.joinerData.id){
    //   this.toHide = false;
    //   // this.timerr.clearInterval();
    // }else if(data && data[0]){
    //   this.executeCommand('hangup');

    // }
  }

  handleParticipantLeft = async (participant) => {
      console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
      this.checkAllParticipants();
  }

  handleParticipantJoined = async (participant) => {
      console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
      // const data = await this.getParticipants();
      // console.log(data);
      this.checkAllParticipants()
  }

  handlechatUpdated = async (participant) => {
      console.log("handlechatUpdated", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
      // const data = await this.getParticipants();
      // console.log(data);
      this.checkAllParticipants()

  }

  handleVideoConferenceLeft = () => {
      console.log("handleVideoConferenceLeft");
      this.toHide = true;
      this.router.navigate(['/live']);
      // history.back
  }

  handleMuteStatus = (audio) => {
      console.log("handleMuteStatus", audio); // { muted: true }
      // this.executeCommand('toggleAudio');
  }

  handleVideoStatus = (video) => {
      console.log("handleVideoStatus", video); // { muted: true }
  }

  handleVideoConferenceJoined = (video) => {
    console.log("handleVideoConferenceJoined", video); // { muted: true }
    this.checkAllParticipants();
  }

  handleIncomingMessage = (video) => {
    console.log("handleIncomingMessage", video); // { muted: true }
  }

  handleOutgoingMessage = (video) => {
    console.log("handleOutgoingMessage", video); // { muted: true }
  }

  handleEndpointTextMessageReceived = (video) => {
    console.log("handleEndpointTextMessageReceived", video); // { muted: true }
  }

  getParticipants() {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve(this.api.getParticipantsInfo()); // get all participants
          }, 500)
      });
  }

  hangUp(){
    this.executeCommand('hangup');
  }

  executeCommand(command: string) {
    this.api.executeCommand(command);
    if(command == 'hangup') {
        this.router.navigate(['/live']);
        return;
    }

    if(command == 'toggleAudio') {
        this.isAudioMuted = !this.isAudioMuted;
        this.api.executeCommand('sendEndpointTextMessage', '', 'text');
        // this.api.executeCommand('sendChatMessage',{
        //   message: 'tesaasdsd  sdsa t', //the text message
        //   to: '', // the receiving participant ID or empty string/undefined for group chat.
        //   ignorePrivacy: true // true if the privacy notification should be ignored. Defaulted to false.
        // });
        if(this.isAudioMuted){
          this.api.executeCommand('startRecording', {
            mode: 'stream', //recording mode, either `file` or `stream`.
            rtmpStreamKey: '9acv-p4d8-713y-bgre-dgdw', //the RTMP stream key.
            // rtmpBroadcastID: 'rtmp://a.rtmp.youtube.com/live2', //the RTMP broadcast ID.
          });
        }else
          this.api.executeCommand('stopRecording', {
            mode: 'stream', //recording mode to stop, `stream` or `file`
            rtmpStreamKey: '9acv-p4d8-713y-bgre-dgdw', //the RTMP stream key.
            // rtmpBroadcastID: 'rtmp://a.rtmp.youtube.com/live2', //the RTMP broadcast ID.
          });
    }

    if(command == 'toggleVideo') {
        this.isVideoMuted = !this.isVideoMuted;
    }
  }

  triggerSearch(event){
    if(this.chatText){
      let messageBody = {
        user_image : this.userDetailsService.UserDetails?.img,
        user_name : this.userDetailsService.UserDetails?.username,
        roomid : this.roomData.roomid,
        message: this.chatText
      };
      this.websocketService.sendMessage(messageBody);
      // document.getElementById('stream-content')?.scrollIntoView(
      //   { behavior: "smooth", block: "end", inline: "start" }
      // );
      var objDiv = document.getElementById('stream-content');
      objDiv.scrollTop = objDiv.scrollHeight+50;
      this.chatText = '';
    }
  }

  ngOnDestroy(){
    this.websocketService.close();
  }

  shareReferral(){
    this.dialog.open(SocialShareComponent, {
      width: '400px',
      // height:  '350px',
      maxWidth: '95vw',
      hasBackdrop: true,
      data: { type: 'room', attributes: this.roomData }
    });
  }
}
