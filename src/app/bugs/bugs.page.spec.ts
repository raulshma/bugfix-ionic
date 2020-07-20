import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BugsPage } from './bugs.page';

describe('BugsPage', () => {
  let component: BugsPage;
  let fixture: ComponentFixture<BugsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BugsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
