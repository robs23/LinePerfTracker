/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserInteractionService } from './userInteraction.service';

describe('Service: UserInteraction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserInteractionService]
    });
  });

  it('should ...', inject([UserInteractionService], (service: UserInteractionService) => {
    expect(service).toBeTruthy();
  }));
});
