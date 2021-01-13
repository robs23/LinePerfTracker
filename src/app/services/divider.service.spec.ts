/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DividerService } from './divider.service';

describe('Service: Divider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DividerService]
    });
  });

  it('should ...', inject([DividerService], (service: DividerService) => {
    expect(service).toBeTruthy();
  }));
});
