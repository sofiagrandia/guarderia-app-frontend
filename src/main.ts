import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { GlobalErrorHandlerService } from './app/services/global-error-handler.service';
import { ErrorHandler } from '@angular/core';

bootstrapApplication(AppComponent, appConfig )
  .catch((err) => console.error(err));
