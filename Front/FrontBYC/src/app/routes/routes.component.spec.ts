import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutesModules } from './routes.modules';

describe('RoutesComponent', () => {
  let component: RoutesModules;
  let fixture: ComponentFixture<RoutesModules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesModules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutesModules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
