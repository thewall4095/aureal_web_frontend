import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as moment_ from 'moment';
const moment = moment_;
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { appConstants } from 'src/app/app.constants';
import { ThemeService } from 'src/app/services/theme.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input("sidenav") sidenav;
  @ViewChild('searchbar') searchbar: ElementRef;

  toggleSearch: boolean = false;
  searchText = '';
  routes = appConstants.routes;

  constructor(
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public userDetailsService: UserDetailsService,
    private themeService: ThemeService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()){
      this.routes = this.routes.filter((route) => route.route != 'home');
    }
    this.updateSearch();
    setTimeout(()=>{
      if(this.authService.isAuthenticated()){
        this.getUserDetails();
      }
    },1000);
  }

  navigateHome() {
    this.router.navigateByUrl('/');
  }

  keyDownFunction(event) {
    console.log(event);
    if (event.code == 'Enter') {
      this.searchWord();
    }
  }

  redirectPost() {
    this.router.navigateByUrl('post');
  }

  openSidebar() {
    this.sidenav.toggle();
  }

  openSearch() {
    this.toggleSearch = true;
    setTimeout(() => {
      console.log(this.searchbar.nativeElement);
      this.searchbar.nativeElement.focus();
    }, 500);
  }

  searchClose() {
    this.searchText = '';
    this.toggleSearch = false;
  }

  searchWord() {
    console.log(this.searchText);
    if (this.searchText) {
      this.router.navigateByUrl('search/' + this.searchText);
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

  getStarted(){
    if (!this.authService.isAuthenticated()) {
      if(window.innerWidth < 756) {
        this.router.navigateByUrl('/home');
      }else{
        this.openHiveAuthDialog(true);
      }
    }
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  navigateTo(route){
    this.router.navigateByUrl(route);
  }

  isActive(route){
    return window.location.pathname == ('/' + route)
  }

  toggleTheme(isDark){
    this.themeService.theme = isDark ? 'dark' : null;
  }

  get dark() {
    return this.themeService.theme === 'dark';
  }
  
  triggerSearch(event){
    this.router.navigateByUrl('search/'+this.searchText);
  }

  updateSearch(){
    if(window.location.pathname.split('/')[1] == 'search'){
      this.searchText = window.location.pathname.split('/')[2];
    }
  }

  getUserDetails(){
    if (!this.userDetailsService.UserDetails && this.authService.isAuthenticated()) {
      this.userDetailsService.getUserDetails(localStorage.getItem('userId')).then((res: any) => {
        console.log(res);
        this.userDetailsService.UserDetails = res.users;
      });
    }
  }

  navigateProfile(){
    this.router.navigateByUrl('/profile');
  }
}
