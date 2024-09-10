import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { isNotLoggedInGuard } from './guards/is-not-logged-in.guard';
import { MeComponent } from './pages/me/me.component';
import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { MyBookingsComponent } from './pages/me/my-bookings/my-bookings.component';
import { MyInfoComponent } from './pages/me/my-info/my-info.component';

import { CentrosComponent } from './pages/centros/centros.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { MascotasComponent } from './pages/mascotas/mascotas.component';


export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path:"centros",
        component:CentrosComponent
    },
    {
        path:"servicios",
        component:ServiciosComponent
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [isNotLoggedInGuard]
    },
    {
        path: "mascotas",
        component: MascotasComponent
    },
    {
        path: "signup",
        component: SignupComponent,
        canActivate: [isNotLoggedInGuard]
    },
    {
        path: "reserva/:id",
        component: ReservaComponent
    },
    {
        path: "me",
        component: MeComponent,
        canActivate: [isLoggedInGuard],
        children:[
            {
                path: "my-bookings",
                component: MyBookingsComponent
            },
            {
                path: "my-info",
                component: MyInfoComponent
            }
        ]
    }
];
