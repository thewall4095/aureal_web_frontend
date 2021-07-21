import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PodcastProfileComponent } from './pages/podcast-profile/podcast-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { AuthInterceptorService } from 'src/app/services/auth-interceptor.service';
import { HiveTokenComponent } from './pages/hive-token/hive-token.component';
import { PostComponent } from './pages/post/post.component';
import { HiveAuthComponent } from './components/hive-auth/hive-auth.component';
import { SearchComponent } from './pages/search/search.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { EmbedComponent } from './pages/embed/embed.component';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { SelectCommunityComponent } from './components/select-community/select-community.component';
import { CreateCommunityComponent } from './components/create-community/create-community.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';// './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { HiveTokenRegisterComponent } from './pages/hive-token-register/hive-token-register.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
} from 'angularx-social-login';
const googleLoginOptions = {
  scope: 'profile email'
};
import { EpisodeListCardComponent } from './components/episode-list-card/episode-list-card.component';
import { EpisodeCardComponent } from './components/episode-card/episode-card.component';
import { PodcastCardComponent } from './components/podcast-card/podcast-card.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { EpisodeDetailsComponent } from './pages/episode-details/episode-details.component';
import { HiveonboardComponent } from './pages/hiveonboard/hiveonboard.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { LiveComponent } from './pages/live/live.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ReferralComponent } from './pages/referral/referral.component';

@NgModule({
  declarations: [
    AppComponent,
    PodcastProfileComponent,
    HeaderComponent,
    FooterComponent,
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
    HiveTokenRegisterComponent,
    EpisodeListCardComponent,
    EpisodeCardComponent,
    PodcastCardComponent,
    DiscoverComponent,
    EpisodeDetailsComponent,
    HiveonboardComponent,
    ExploreComponent,
    LiveComponent,
    AboutUsComponent,
    LandingComponent,
    ReferralComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SharedModule,
    SocialLoginModule,
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
  exports: []
})
export class AppModule { }
