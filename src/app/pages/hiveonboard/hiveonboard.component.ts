import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Slide } from "src/app/components/carousel/carousel.interface";
import { AnimationType } from "src/app/components/carousel/carousel.animation";
import { CarouselComponent } from 'src/app/components/carousel/carousel.component';;
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetatagsService } from 'src/app/services/metatags.service';

@Component({
  selector: 'app-hiveonboard',
  templateUrl: './hiveonboard.component.html',
  styleUrls: ['./hiveonboard.component.scss']
})
export class HiveonboardComponent implements OnInit {
  @ViewChild(CarouselComponent) carousel: CarouselComponent;

  animationType = AnimationType.Scale;
  slides: Slide[] = [
    {
      headline: `          <h3 style="color:var(--theme-background);">Visit hiveonboard.com</h3>
      <h3 style="color:var(--theme-background);">Choose a username which suits you best. </h3>
      <h3 style="color:var(--theme-background);">Check the box next to "I agree to the terms of service" and click on CONTINUE. </h3>`,
      src:
        "./assets/hiveonboard_images/HIVEonboardingscreenshots-01.jpg"
    },
    {
      headline: `          <h3 style="color:var(--theme-background);">You will see your proposed account information here.</h3>
      <h3 style="color:var(--theme-background);">Download a backup of the keys and store it someplace safe and secure. This is <strong>important</strong> for you to have an access of your account all the time. </h3>
      <h3 style="color:var(--theme-background);">Check the box and click on "CREATE HIVE ACCOUNT"</h3>`,
      src:
      "./assets/hiveonboard_images/HIVEonboardingscreenshots-02.jpg"
    },
    {
      headline: `          <h3 style="color:var(--theme-background);">Next step is to verify your accout using your phone number.</h3>
      <h3 style="color:var(--theme-background);">Select your country code, type in your number and click on "REQUEST SMS" </h3>
      <h3 style="color:var(--theme-background);">You will receive an OTP on the number you used. Enter it and your account will be verified.</h3>
      <h3 style="color:var(--theme-background);">Your phone number is only used for this verification and won't be given to 3rd parties or used for any other purposes.</h3>`,
      src:
      "./assets/hiveonboard_images/HIVEonboardingscreenshots-03.jpg"
    },
    {
      headline: `          <h3 style="color:var(--theme-background);">Your HIVE account is created now </h3>
      <h3 style="color:var(--theme-background);">Here you can explore other apps you can access using your HIVE account. </h3>`,
      src:
      "./assets/hiveonboard_images/HIVEonboardingscreenshots-04.jpg"
    },
    {
      headline: `          <h3 style="color:var(--theme-background);">Head back to aureal.one </h3>
      <h3 style="color:var(--theme-background);">Click on Log in with Hivesigner </h3>
      <h3 style="color:var(--theme-background);">Input your username and Master Password in the fields. </h3>
      <h3 style="color:var(--theme-background);">Click on Continue </h3>`,
      src:
      "./assets/hiveonboard_images/HIVEonboardingscreenshots-05.jpg"
    },
    {
      headline: `          <h3 style="color:var(--theme-background);">Here you have to set a password for Hivesigner. This is different from your HIVE account private key. </h3>
      <h3 style="color:var(--theme-background);">Once you confirm the password, you will be able to login with Hivesigner using this password. </h3>
      <h3 style="color:var(--theme-background);">Click on 'Import Account' </h3>`,
      src:
      "./assets/hiveonboard_images/HIVEonboardingscreenshots-06.jpg"
    },
    {
      headline: `          <h3 style="color:var(--theme-background);">Clicking on 'Authorize' enables your activity on Aureal </h3>
      <h3 style="color:var(--theme-background);">You can withdraw this at any time you want. </h3>
      <h3 style="color:var(--theme-background);">Done. Welcome to Aureal </h3>`,
      src:
      "./assets/hiveonboard_images/HIVEonboardingscreenshots-07.jpg"
    }
  ];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public metatagsService: MetatagsService,
  ) { 
    this.metatagsService.defaultTags();
  }

  ngOnInit(): void {
  }

  setAnimationType(type) {
    this.animationType = type.value;
    setTimeout(() => {
      this.carousel.onNextClick();
    });
  }

}
