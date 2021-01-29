/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductionPlanService } from './production-plan.service';

describe('Service: ProductionPlan', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductionPlanService]
    });
  });

  it('should ...', inject([ProductionPlanService], (service: ProductionPlanService) => {
    expect(service).toBeTruthy();
  }));
});
