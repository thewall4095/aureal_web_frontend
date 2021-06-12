import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { SafeHtmlPipe } from 'src/app/pipes/safehtml.pipe';
import { ImagePreloadDirective } from 'src/app/directives/image-preload.directive';
import { MatChipsModule } from '@angular/material/chips';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MinuteSecondPipe } from 'src/app/pipes/minute-second.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthComponent } from 'src/app/components/auth/auth.component';
import { PlayerComponent } from 'src/app/components/player/player.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from'@angular/material/tabs';
import { MatTableModule } from'@angular/material/table';
import { MatListModule } from'@angular/material/list';
import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from 'src/app/components/comment/comment.component';
import { CommentBoxComponent } from 'src/app/components/comment-box/comment-box.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { FavoriteEpisodeComponent } from 'src/app/components/favorite-episode/favorite-episode.component';
import { CarouselComponent } from 'src/app/components/carousel/carousel.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ClipboardModule } from '@angular/cdk/clipboard'

@NgModule({
  declarations: [
    DateAgoPipe, 
    SafeHtmlPipe,
    ImagePreloadDirective,
    MinuteSecondPipe,
    AuthComponent,
    PlayerComponent,
    SocialShareComponent,
    CommentComponent,
    CommentBoxComponent,
    LoaderComponent,
    CarouselComponent,
    FavoriteEpisodeComponent,
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MatDialogModule,
    NgxAudioPlayerModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatChipsModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    MatProgressBarModule,
    NgbModule,
    InfiniteScrollModule,
    NgxAudioPlayerModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgxIntlTelInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    LazyLoadImageModule,
    ClipboardModule

  ],
  exports: [
    DateAgoPipe, 
    SafeHtmlPipe,
    ImagePreloadDirective,
    MinuteSecondPipe,
    AuthComponent,
    PlayerComponent,
    SocialShareComponent,
    InfiniteScrollModule,
    MatDialogModule,
    NgxAudioPlayerModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatChipsModule,
    ShareButtonsModule,
    ShareIconsModule,
    MatProgressBarModule,
    NgbModule,
    InfiniteScrollModule,
    NgxAudioPlayerModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgxIntlTelInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    ToastrModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    CommentComponent,
    CommentBoxComponent,
    LoaderComponent,
    CarouselComponent,
    FavoriteEpisodeComponent,
    LazyLoadImageModule,
    ClipboardModule

  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },

  ]
})
export class SharedModule { }
