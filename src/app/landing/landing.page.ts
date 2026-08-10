import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideArrowRight,
  LucideBadgeCheck,
  LucideBot,
  LucideBrainCircuit,
  LucideBriefcaseBusiness,
  LucideCalendarCheck,
  LucideCalculator,
  LucideChartNoAxesCombined,
  LucideCheckCircle,
  LucideCloud,
  LucideCode2,
  LucideFilter,
  LucideHome,
  LucideMessageCircle,
  LucidePhoneCall,
  LucideSend,
  LucideShieldCheck,
  LucideSparkles,
  LucideXCircle
} from '@lucide/angular';
import { ApiService, ProjectKind } from '../core/api.service';

type SubmissionState = 'idle' | 'loading' | 'success' | 'error' | 'offline';
type ServiceIcon = 'code' | 'business' | 'commerce' | 'bot' | 'brain' | 'cloud';

interface ServiceCard {
  title: string;
  summary: string;
  items: readonly string[];
  accent: string;
  icon: ServiceIcon;
}

interface ProjectCard {
  category: ProjectKind | 'Automatización';
  name: string;
  description: string;
  metric: string;
}

interface SuccessCase {
  company: string;
  problem: string;
  solution: string;
  result: string;
  metric: string;
}

@Component({
  selector: 'app-landing-page',
  imports: [
    ReactiveFormsModule,
    LucideArrowRight,
    LucideBadgeCheck,
    LucideBot,
    LucideBrainCircuit,
    LucideBriefcaseBusiness,
    LucideCalendarCheck,
    LucideCalculator,
    LucideChartNoAxesCombined,
    LucideCheckCircle,
    LucideCloud,
    LucideCode2,
    LucideFilter,
    LucideHome,
    LucideMessageCircle,
    LucidePhoneCall,
    LucideSend,
    LucideShieldCheck,
    LucideSparkles,
    LucideXCircle
  ],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPage implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  readonly projectTypes: readonly ProjectKind[] = ['Landing', 'CRM', 'E-commerce', 'ERP', 'App', 'IA'];
  readonly selectedProject = signal<ProjectKind>('CRM');
  readonly selectedModules = signal<readonly string[]>(['Dashboard', 'Seguridad', 'Automatización']);
  readonly portfolioFilter = signal<ProjectKind | 'Automatización' | 'Todos'>('Todos');
  readonly submissionState = signal<SubmissionState>('idle');
  readonly floatingNavVisible = signal(false);

  readonly leadForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    company: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    email: ['', [Validators.required, Validators.email]],
    budgetRange: ['USD 3k - 8k', Validators.required],
    message: [
      'Necesito digitalizar procesos comerciales con una solución segura y escalable.',
      [Validators.required, Validators.minLength(10)]
    ]
  });

  readonly estimateLabel = computed(() => {
    const estimate = this.estimates[this.selectedProject()];
    const multiplier = 1 + this.selectedModules().length * 0.12;
    const min = Math.round(estimate.min * multiplier);
    const max = Math.round(estimate.max * multiplier);

    return `USD ${this.formatMoney(min)} - ${this.formatMoney(max)}`;
  });

  readonly estimatedTimeline = computed(() => this.estimates[this.selectedProject()].timeline);

  readonly filteredProjects = computed(() => {
    const filter = this.portfolioFilter();

    if (filter === 'Todos') {
      return this.projects;
    }

    return this.projects.filter((project) => project.category === filter);
  });

  readonly whatsappUrl =
    'https://wa.me/593963388467?text=Hola%2C%20deseo%20informaci%C3%B3n%20sobre%20sus%20servicios%20tecnol%C3%B3gicos.';

  readonly services: readonly ServiceCard[] = [
    {
      title: 'Desarrollo Web',
      summary: 'Landing pages, sitios corporativos y portales empresariales con SEO y conversión.',
      items: ['Landing Pages', 'Sitios Corporativos', 'Portales Empresariales'],
      accent: 'cyan',
      icon: 'code'
    },
    {
      title: 'Sistemas Empresariales',
      summary: 'ERP, CRM, inventarios y facturación diseñados alrededor del proceso real.',
      items: ['ERP', 'CRM', 'Inventarios', 'Facturación'],
      accent: 'blue',
      icon: 'business'
    },
    {
      title: 'Comercio Electrónico',
      summary: 'Tiendas online con pasarelas de pago, catálogos, logística e integraciones.',
      items: ['Tiendas Online', 'Pasarelas de Pago', 'Integraciones'],
      accent: 'green',
      icon: 'commerce'
    },
    {
      title: 'Automatización',
      summary: 'Bots, integraciones y procesos automáticos para reducir trabajo operativo.',
      items: ['Bots', 'Integraciones', 'Procesos Automáticos'],
      accent: 'amber',
      icon: 'bot'
    },
    {
      title: 'Inteligencia Artificial',
      summary: 'Chatbots, agentes IA y asistentes inteligentes conectados a datos del negocio.',
      items: ['Chatbots', 'Agentes IA', 'Asistentes Inteligentes'],
      accent: 'indigo',
      icon: 'brain'
    },
    {
      title: 'Consultoría Tecnológica',
      summary: 'Arquitectura, migraciones, optimización y roadmap digital para escalar.',
      items: ['Arquitectura', 'Migraciones', 'Optimización'],
      accent: 'slate',
      icon: 'cloud'
    }
  ];

  readonly securityItems = [
    'JWT',
    'HTTPS',
    'OWASP',
    'SQL Injection Protection',
    'XSS Protection',
    'MFA',
    'Encriptación',
    'Auditoría'
  ] as const;

  readonly technologies = [
    ['Angular', 'Avanzado'],
    ['React', 'Avanzado'],
    ['.NET', 'Avanzado'],
    ['Spring Boot', 'Avanzado'],
    ['SQL Server', 'Avanzado'],
    ['Oracle', 'Avanzado'],
    ['MySql', 'Avanzado'],
    ['Azure', 'Cloud Ready'],
    ['AWS', 'Cloud Ready'],
    ['Docker', 'Producción'],
    ['GitHub', 'CI/CD'],
    ['OpenAI', 'IA aplicada'],
    ['Tailwind', 'UI System'],
    ['TypeScript', 'Strict'],
    ['Redis', 'Performance'],
    ['RabbitMQ', 'Mensajería'],
  ] as const;

  readonly portfolioFilters = ['Todos', 'Landing', 'CRM', 'ERP', 'E-commerce', 'Automatización', 'IA'] as const;

  readonly projects: readonly ProjectCard[] = [
    {
      category: 'CRM',
      name: 'Pipeline comercial B2B',
      description: 'Prospectos, cotizaciones, seguimiento y KPIs para equipos de ventas.',
      metric: '+150% velocidad de seguimiento'
    },
    {
      category: 'ERP',
      name: 'Operación financiera integrada',
      description: 'Inventario, facturación y reportes gerenciales en una sola plataforma.',
      metric: '-38% tareas manuales'
    },
    {
      category: 'E-commerce',
      name: 'Comercio omnicanal',
      description: 'Catálogo, pagos, logística y automatización de clientes recurrentes.',
      metric: '+300% conversión'
    },
    {
      category: 'Landing',
      name: 'Adquisición de leads premium',
      description: 'Landing orientada a venta consultiva, velocidad y posicionamiento SEO.',
      metric: '+220% leads calificados'
    },
    {
      category: 'Automatización',
      name: 'Backoffice automatizado',
      description: 'Flujos con bots, integraciones y alertas operativas.',
      metric: '+500% productividad'
    },
    {
      category: 'IA',
      name: 'Asistente inteligente interno',
      description: 'Agente IA conectado a documentos, CRM y procesos de atención.',
      metric: '-62% tiempo de respuesta'
    }
  ];

  readonly successCases: readonly SuccessCase[] = [
    {
      company: 'Retail regional',
      problem: 'Procesos de ventas dispersos y baja trazabilidad del cliente.',
      solution: 'CRM con automatizaciones, cotizador y dashboard ejecutivo.',
      result: 'Seguimiento comercial centralizado y decisiones con datos diarios.',
      metric: '+300%'
    },
    {
      company: 'Servicios B2B',
      problem: 'Generación de prospectos sin priorización ni scoring.',
      solution: 'Landing premium, lead scoring y pipeline consultivo.',
      result: 'Mayor tasa de reuniones calificadas para el equipo comercial.',
      metric: '+150%'
    },
    {
      company: 'Operación logística',
      problem: 'Inventario, facturación y reportes duplicados en hojas manuales.',
      solution: 'Sistema empresarial con roles, auditoría y analítica operativa.',
      result: 'Menos errores, cierres más rápidos y operación escalable.',
      metric: '+500%'
    }
  ];

  private readonly estimates: Record<ProjectKind, { min: number; max: number; timeline: string }> = {
    Landing: { min: 250, max: 1500, timeline: '2 a 4 semanas' },
    CRM: { min: 600, max: 8000, timeline: '6 a 10 semanas' },
    'E-commerce': { min: 1000, max: 9500, timeline: '5 a 9 semanas' },
    ERP: { min: 9000, max: 28000, timeline: '10 a 18 semanas' },
    App: { min: 6500, max: 18000, timeline: '8 a 14 semanas' },
    IA: { min: 3500, max: 14000, timeline: '4 a 12 semanas' }
  };

  ngAfterViewInit(): void {
    this.updateFloatingNavVisibility();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateFloatingNavVisibility();
  }

  selectProject(project: ProjectKind): void {
    this.selectedProject.set(project);
  }

  toggleModule(module: string): void {
    const current = this.selectedModules();
    const exists = current.includes(module);
    const next = exists ? current.filter((item) => item !== module) : [...current, module];

    this.selectedModules.set(next);
  }

  setPortfolioFilter(filter: ProjectKind | 'Automatización' | 'Todos'): void {
    this.portfolioFilter.set(filter);
  }

  submitLead(): void {
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      this.submissionState.set('error');
      return;
    }

    const form = this.leadForm.getRawValue();
    this.submissionState.set('loading');

    this.api
      .createLead({
        ...form,
        projectType: this.selectedProject(),
        estimatedInvestment: this.estimateLabel()
      })
      .subscribe({
        next: () => this.submissionState.set('success'),
        error: () => this.submissionState.set('offline')
      });
  }

  isInvalid(field: keyof typeof this.leadForm.controls): boolean {
    const control = this.leadForm.controls[field];

    return control.invalid && (control.dirty || control.touched);
  }

  private formatMoney(value: number): string {
    return value.toLocaleString('en-US');
  }

  private updateFloatingNavVisibility(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.floatingNavVisible.set(window.scrollY > 420);
  }
}
