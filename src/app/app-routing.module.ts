import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PodcastProfileComponent } from './pages/podcast-profile/podcast-profile.component';
// import { HomeDashboardModule } from 'src/app/pages/home-dashboard/home-dashboard.module';
import { AuthComponent } from './components/auth/auth.component';
import { HiveTokenComponent } from './pages/hive-token/hive-token.component';
import { HiveTokenRegisterComponent } from './pages/hive-token-register/hive-token-register.component';
import { PostComponent } from './pages/post/post.component';
import { SearchComponent } from './pages/search/search.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { EmbedComponent } from './pages/embed/embed.component';
import { EpisodeDetailsComponent } from './pages/episode-details/episode-details.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { HiveonboardComponent } from './pages/hiveonboard/hiveonboard.component';
import { LiveComponent } from './pages/live/live.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

const routes: Routes = [
  // { path: "", loadChildren: './pages/home-dashboard/home-dashboard.module#HomeDashboardModule' },
  {
    path: "podcast/:podcast_id", component: PodcastProfileComponent,
  },
  { path: "auth", component: AuthComponent },
  { path: "hive-token", component: HiveTokenComponent },
  { path: "hive-token-register", component: HiveTokenRegisterComponent },
  { path: "post", component: PostComponent },
  { path: "search/:query", component: SearchComponent },
  { path: "profile", component: UserProfileComponent },
  { path: "embed/:episode_id", component: EmbedComponent },
  { path: "episode/:episode_id", component: EpisodeDetailsComponent },
  { path: '', component: LandingComponent },
  { path: 'home', component: DiscoverComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'live', component: LiveComponent },
  { path: 'episode/:episode_id', component: EpisodeDetailsComponent },
  { path: 'hive-onboarding', component: HiveonboardComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
