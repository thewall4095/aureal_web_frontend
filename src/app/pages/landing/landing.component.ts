import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { HiveAuthComponent } from 'src/app/components/hive-auth/hive-auth.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from "@angular/router";
import { ThemeService } from 'src/app/services/theme.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  @ViewChild('container') container: ElementRef;
  @ViewChild('inner') inner: ElementRef;
  mouse = {
    _x: 0,
    _y: 0,
    x: 0,
    y: 0,
    updatePosition: function(event) {
      var e = event || window.event;
      this.x = e.clientX - this._x;
      this.y = (e.clientY - this._y) * -1;
    },
    setOrigin: function(e) {
      this._x = e.nativeElement.offsetLeft + Math.floor(e.nativeElement.offsetWidth / 2);
      this._y = e.nativeElement.offsetTop + Math.floor(e.nativeElement.offsetHeight / 2);
    },
    show: function() {
      return "(" + this.x + ", " + this.y + ")";
    }
  };
  counter = 0;
  refreshRate = 10;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public authService: AuthService,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public metatagsService: MetatagsService,
  ) { 
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    this.metatagsService.defaultTags();
  }

  ngOnInit(): void {
      // Mouse

    // Track the mouse position relative to the center of the container.
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/home');
    }
  }

  ngAfterViewInit(){
    this.mouse.setOrigin(this.container);
  }

  isTimeToUpdate() {
    return this.counter++ % this.refreshRate === 0;
  };

  onMouseEnterHandler(event) {
    this.update(event);
  };

  onMouseLeaveHandler(){
    this.inner.nativeElement.style = "";
  };

  onMouseMoveHandler(event){
    if (this.isTimeToUpdate()) {
      this.update(event);
    }
  };

  //----------------------------------------------------

  update(event) {
    this.mouse.updatePosition(event);
    this.updateTransformStyle(
      (this.mouse.y / this.inner.nativeElement.offsetHeight / 2).toFixed(2),
      (this.mouse.x / this.inner.nativeElement.offsetWidth / 2).toFixed(2)
    );
  };

  updateTransformStyle(x, y) {
    var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    this.inner.nativeElement.style.transform = style;
    this.inner.nativeElement.style.webkitTransform = style;
    this.inner.nativeElement.style.mozTranform = style;
    this.inner.nativeElement.style.msTransform = style;
    this.inner.nativeElement.style.oTransform = style;
  };

  getStarted(){
    if (!this.authService.isAuthenticated()) {
      if(window.innerWidth < 756) {
        this.router.navigateByUrl('/home');
      }else{
        this.openHiveAuthDialog(true);
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

  toggleTheme(isDark){
    this.themeService.theme = isDark ? 'dark' : null;
  }

  get dark() {
    return this.themeService.theme === 'dark';
  }
}
