import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TechPage } from './tech.page';

describe('TechPage', () => {
  let component: TechPage;
  let fixture: ComponentFixture<TechPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TechPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
