/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActiveCellService } from './active-cell.service';

describe('Service: ActiveCell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveCellService]
    });
  });

  it('should ...', inject([ActiveCellService], (service: ActiveCellService) => {
    expect(service).toBeTruthy();
  }));
});
