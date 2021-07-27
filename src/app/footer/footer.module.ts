import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './footer.component';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    FooterComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule {
}
