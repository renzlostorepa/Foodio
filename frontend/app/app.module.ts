import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClienteComponent} from './cliente/cliente.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './auth.guard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {RistoratoreComponent} from './ristoratore/ristoratore.component';
import {RiderComponent} from './rider/rider.component';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MapComponent} from './map/map.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import {OrderComponent} from './order/order.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RegistrazioneComponent} from './registrazione/registrazione.component';


@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    LoginComponent,
    RistoratoreComponent,
    RiderComponent,
    MapComponent,
    OrderComponent,
    RegistrazioneComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatDialogModule,
    MatDividerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {
}
