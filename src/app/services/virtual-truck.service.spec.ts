/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VirtualTruckService } from './virtual-truck.service';

describe('Service: VirtualTruck', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VirtualTruckService]
    });
  });

  it('should ...', inject([VirtualTruckService], (service: VirtualTruckService) => {
    expect(service).toBeTruthy();
  }));
});
