import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PodcastProfileComponent } from './pages/podcast-profile/podcast-profile.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MinuteSecondPipe } from './pipes/minute-second.pipe';
import { HeaderComponent } from './components/header/header.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HomeDashboardModule } from 'src/app/pages/home-dashboard/home-dashboard.module';
import { AuthComponent } from './components/auth/auth.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { PlayerComponent } from 'src/app/components/player/player.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthInterceptorService } from 'src/app/services/auth-interceptor.service';
import { HiveTokenComponent } from './pages/hive-token/hive-token.component';

import { PostComponent } from './pages/post/post.component';
// import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatSidenavModule } from '@angular/material/sidenav';
import { HiveAuthComponent } from './components/hive-auth/hive-auth.component';
import { SearchComponent } from './pages/search/search.component';
import { MatTabsModule } from'@angular/material/tabs';
import { MatTableModule } from'@angular/material/table';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { EmbedComponent } from './pages/embed/embed.component';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { SelectCommunityComponent } from './components/select-community/select-community.component';
import { CreateCommunityComponent } from './components/create-community/create-community.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';// './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { SocialShareComponent } from './components/social-share/social-share.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
} from 'angularx-social-login';
import { HiveTokenRegisterComponent } from './pages/hive-token-register/hive-token-register.component';

const googleLoginOptions = {
  scope: 'profile email'
};

@NgModule({
  declarations: [
    AppComponent,
    PodcastProfileComponent,
    MinuteSecondPipe,
    HeaderComponent,
    FooterComponent,
    AuthComponent,
    PlayerComponent,
    HiveTokenComponent,
    PostComponent,
    HiveAuthComponent,
    SearchComponent,
    UserProfileComponent,
    EmbedComponent,
    CopyClipboardDirective,
    SelectCommunityComponent,
    CreateCommunityComponent,
    ConfirmationDialogComponent,
    SocialShareComponent,
    HiveTokenRegisterComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    InfiniteScrollModule,
    HomeDashboardModule,
    NgxAudioPlayerModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
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
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SocialLoginModule
  ],
  providers: [
    ConfirmationDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '206317282199-s7jlkicorlusser9n9hu53mh3o6g148s.apps.googleusercontent.com', googleLoginOptions
            )
          },
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent],
  exports: [NgbModule]
})
export class AppModule { }
