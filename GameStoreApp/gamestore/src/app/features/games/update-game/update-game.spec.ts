import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGame } from './update-game';

describe('UpdateGame', () => {
  let component: UpdateGame;
  let fixture: ComponentFixture<UpdateGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
