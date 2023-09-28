import {TestBed} from '@angular/core/testing';

import {ConversionFactorService} from './conversion-factor.service';

describe('ConversionFactorService', () => {
  let service: ConversionFactorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversionFactorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
