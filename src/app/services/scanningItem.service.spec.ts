/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScanningItemService } from './scanningItem.service';

describe('Service: ScanningItem', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScanningItemService]
    });
  });

  it('should ...', inject([ScanningItemService], (service: ScanningItemService) => {
    expect(service).toBeTruthy();
  }));
});
