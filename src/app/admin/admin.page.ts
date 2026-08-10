import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideCircleDollarSign,
  LucideKanban,
  LucideLayoutDashboard,
  LucideLockKeyhole,
  LucideLogOut,
  LucideSend,
  LucideShieldCheck,
  LucideTrendingUp,
  LucideUsers
} from '@lucide/angular';
import { ApiService, AuthResponse, DashboardKpi, LeadResponse } from '../core/api.service';

type LoginState = 'idle' | 'loading' | 'ready' | 'demo' | 'error';

@Component({
  selector: 'app-admin-page',
  imports: [
    ReactiveFormsModule,
    LucideCircleDollarSign,
    LucideKanban,
    LucideLayoutDashboard,
    LucideLockKeyhole,
    LucideLogOut,
    LucideSend,
    LucideShieldCheck,
    LucideTrendingUp,
    LucideUsers
  ],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPage {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['admin@mjsoftsolutions.com', [Validators.required, Validators.email]],
    password: ['Admin123*', [Validators.required, Validators.minLength(8)]]
  });

  readonly auth = signal<AuthResponse | null>(null);
  readonly loginState = signal<LoginState>('idle');
  readonly kpis = signal<DashboardKpi>({
    activeProspects: 26,
    qualifiedPipeline: 84200,
    conversionRate: 38,
    averageTicket: 6400
  });
  readonly prospects = signal<LeadResponse[]>([
    {
      id: 'demo-1',
      name: 'Andrea Paredes',
      company: 'Andes Retail',
      phone: '+593 99 000 1001',
      email: 'andrea@andesretail.com',
      projectType: 'CRM',
      budgetRange: 'USD 8k - 20k',
      message: 'CRM con seguimiento de leads y cotizador.',
      estimatedInvestment: 'USD 6,120 - 16,320',
      status: 'Qualified',
      createdAt: new Date().toISOString()
    },
    {
      id: 'demo-2',
      name: 'Carlos Mejía',
      company: 'Logisur',
      phone: '+593 99 000 1002',
      email: 'carlos@logisur.com',
      projectType: 'ERP',
      budgetRange: 'USD 20k+',
      message: 'Necesitamos inventario, facturación y reportes.',
      estimatedInvestment: 'USD 12,240 - 38,080',
      status: 'Proposal',
      createdAt: new Date().toISOString()
    },
    {
      id: 'demo-3',
      name: 'Sofía Andrade',
      company: 'Nexo Academy',
      phone: '+593 99 000 1003',
      email: 'sofia@nexo.ac',
      projectType: 'IA',
      budgetRange: 'USD 3k - 8k',
      message: 'Asistente IA para consultas de estudiantes.',
      estimatedInvestment: 'USD 4,760 - 19,040',
      status: 'New',
      createdAt: new Date().toISOString()
    }
  ]);

  readonly pipeline = computed(() => {
    const stages = ['New', 'Qualified', 'Proposal', 'Won'] as const;

    return stages.map((stage) => ({
      stage,
      total: this.prospects().filter((prospect) => prospect.status === stage).length
    }));
  });

  readonly qualifiedValue = computed(() => `$${this.kpis().qualifiedPipeline.toLocaleString('en-US')}`);
  readonly averageTicket = computed(() => `$${this.kpis().averageTicket.toLocaleString('en-US')}`);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem('mj_auth');

      if (raw) {
        this.auth.set(JSON.parse(raw) as AuthResponse);
        this.loginState.set('ready');
        this.loadCrm();
      }
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginState.set('error');
      return;
    }

    const credentials = this.loginForm.getRawValue();
    this.loginState.set('loading');

    this.api.login(credentials.email, credentials.password).subscribe({
      next: (auth) => {
        this.auth.set(auth);
        this.loginState.set('ready');
        this.persistAuth(auth);
        this.loadCrm();
      },
      error: () => {
        this.loginState.set('demo');
        this.auth.set({
          accessToken: 'demo-token',
          refreshToken: 'demo-refresh',
          expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          email: credentials.email,
          role: 'Administrador'
        });
      }
    });
  }

  logout(): void {
    this.auth.set(null);
    this.loginState.set('idle');

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('mj_auth');
    }
  }

  private loadCrm(): void {
    const auth = this.auth();

    if (!auth || auth.accessToken === 'demo-token') {
      return;
    }

    this.api.dashboard(auth.accessToken).subscribe({
      next: (kpis) => this.kpis.set(kpis)
    });

    this.api.prospects(auth.accessToken).subscribe({
      next: (prospects) => this.prospects.set(prospects)
    });
  }

  private persistAuth(auth: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mj_auth', JSON.stringify(auth));
    }
  }
}
