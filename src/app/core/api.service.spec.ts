import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiService);
  });

  it('should build a mailto fallback for offline lead submissions', () => {
    const payload = {
      name: 'Ana López',
      company: 'Mundo Digital',
      phone: '+593999123456',
      email: 'ana@ejemplo.com',
      projectType: 'Landing' as const,
      budgetRange: 'USD 230 - 500',
      message: 'Necesito una landing para captar leads.',
      estimatedInvestment: 'USD 230'
    };

    const mailLink = service.buildLeadEmailLink(payload);

    expect(mailLink).toContain('mailto:jeffer.mio@gmail.com');
    expect(mailLink).toContain(encodeURIComponent('Nuevo lead: Ana López - Mundo Digital'));
    expect(mailLink).toContain(encodeURIComponent('Correo del cliente: ana@ejemplo.com'));
  });
});
