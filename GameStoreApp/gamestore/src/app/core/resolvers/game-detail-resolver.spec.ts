import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { gameDetailResolver } from './game-detail-resolver';

describe('gameDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => gameDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
