import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  handleError(error: any) {
    if (error.message && error.message.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
      // Log or ignore the error (temporary suppression)
      console.warn('ExpressionChangedAfterItHasBeenCheckedError ignored:', error);
    } else {
      // Re-throw other errors for the Angular default handler
      throw error;
    }
  }
}
