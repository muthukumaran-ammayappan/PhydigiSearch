import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'phydigi';
  public isMenuOpen: boolean = false;
  public sideMenuList: any = [
    {
      code: "about-us",
      name: "About us",
      routeTo: "https://phydigi.com",
      inside: false,
      icon: "error_outline"
    },
    /* {
      code: "login",
      name: "Login",
      routeTo: "/login",
      inside: true,
      icon: "login"
    },
    {
      code: "logout",
      name: "Logout",
      routeTo: "/logout",
      inside: true,
      icon: "logout"
    } */
  ];

  isMobile;

  deferredPrompt: any;
  showButton: boolean = false;

  constructor(){
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }
  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  public onSidenavClick(): void {
    this.isMenuOpen = false;
  }
}
