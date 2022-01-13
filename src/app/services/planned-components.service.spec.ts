/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlannedComponentsService } from './planned-components.service';

describe('Service: PlannedComponents', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlannedComponentsService]
    });
  });

  it('should ...', inject([PlannedComponentsService], (service: PlannedComponentsService) => {
    expect(service).toBeTruthy();
  }));
});
