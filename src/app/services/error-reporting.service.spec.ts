import { TestBed } from '@angular/core/testing';

import { ErrorReportingService } from './error-reporting.service';

describe('ErrorReportingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorReportingService = TestBed.get(ErrorReportingService);
    expect(service).toBeTruthy();
  });
});
