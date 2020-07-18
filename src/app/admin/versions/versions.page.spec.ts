import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VersionsPage } from './versions.page';

describe('VersionsPage', () => {
  let component: VersionsPage;
  let fixture: ComponentFixture<VersionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VersionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
