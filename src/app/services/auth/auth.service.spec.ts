import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  // let service: AuthService;

  beforeEach(() => {
   // service = new AuthService(new HttpClient(), new ToastController());

    return TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AuthService]
    });
  });

  it('should be created', () => {
    // expect(service)
       // .toBeTruthy();
  });
});
