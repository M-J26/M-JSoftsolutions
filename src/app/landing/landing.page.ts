// import {
//   AfterViewInit,
//   ChangeDetectionStrategy,
//   Component,
//   HostListener,
//   computed,
//   inject,
//   signal
// } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import {
//   LucideArrowRight,
//   LucideBadgeCheck,
//   LucideBot,
//   LucideBrainCircuit,
//   LucideBriefcaseBusiness,
//   LucideCalendarCheck,
//   LucideCalculator,
//   LucideChartNoAxesCombined,
//   LucideCheckCircle,
//   LucideCloud,
//   LucideCode2,
//   LucideFilter,
//   LucideHome,
//   LucideMessageCircle,
//   LucidePhoneCall,
//   LucideSend,
//   LucideShieldCheck,
//   LucideSparkles,
//   LucideXCircle
// } from '@lucide/angular';
// import { ApiService, ProjectKind } from '../core/api.service';

// type SubmissionState = 'idle' | 'loading' | 'success' | 'error' | 'offline';
// type ServiceIcon = 'code' | 'business' | 'commerce' | 'bot' | 'brain' | 'cloud';

// interface ServiceCard {
//   title: string;
//   summary: string;
//   items: readonly string[];
//   accent: string;
//   icon: ServiceIcon;
// }

// interface ProjectCard {
//   category: ProjectKind | 'Automatización';
//   name: string;
//   description: string;
//   metric: string;
// }

// interface SuccessCase {
//   company: string;
//   problem: string;
//   solution: string;
//   result: string;
//   metric: string;
// }

// @Component({
//   selector: 'app-landing-page',
//   imports: [
//     ReactiveFormsModule,
//     LucideArrowRight,
//     LucideBadgeCheck,
//     LucideBot,
//     LucideBrainCircuit,
//     LucideBriefcaseBusiness,
//     LucideCalendarCheck,
//     LucideCalculator,
//     LucideChartNoAxesCombined,
//     LucideCheckCircle,
//     LucideCloud,
//     LucideCode2,
//     LucideFilter,
//     LucideHome,
//     LucideMessageCircle,
//     LucidePhoneCall,
//     LucideSend,
//     LucideShieldCheck,
//     LucideSparkles,
//     LucideXCircle
//   ],
//   templateUrl: './landing.page.html',
//   styleUrl: './landing.page.css',
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class LandingPage implements AfterViewInit {
//   private readonly fb = inject(FormBuilder);
//   private readonly api = inject(ApiService);

//   readonly projectTypes: readonly ProjectKind[] = ['Landing', 'CRM', 'E-commerce', 'ERP', 'App', 'IA'];
//   readonly selectedProject = signal<ProjectKind>('CRM');
//   readonly selectedModules = signal<readonly string[]>(['Dashboard', 'Seguridad', 'Automatización']);
//   readonly portfolioFilter = signal<ProjectKind | 'Automatización' | 'Todos'>('Todos');
//   readonly submissionState = signal<SubmissionState>('idle');
//   readonly floatingNavVisible = signal(false);

//   readonly leadForm = this.fb.nonNullable.group({
//     name: ['', [Validators.required, Validators.minLength(2)]],
//     company: ['', [Validators.required, Validators.minLength(2)]],
//     phone: ['', [Validators.required, Validators.minLength(7)]],
//     email: ['', [Validators.required, Validators.email]],
//     budgetRange: ['USD 3k - 8k', Validators.required],
//     message: [
//       'Necesito digitalizar procesos comerciales con una solución segura y escalable.',
//       [Validators.required, Validators.minLength(10)]
//     ]
//   });

//   readonly estimateLabel = computed(() => {
//     const estimate = this.estimates[this.selectedProject()];
//     const multiplier = 1 + this.selectedModules().length * 0.12;
//     const min = Math.round(estimate.min * multiplier);
//     const max = Math.round(estimate.max * multiplier);

//     return `USD ${this.formatMoney(min)} - ${this.formatMoney(max)}`;
//   });

//   readonly estimatedTimeline = computed(() => this.estimates[this.selectedProject()].timeline);

//   readonly filteredProjects = computed(() => {
//     const filter = this.portfolioFilter();

//     if (filter === 'Todos') {
//       return this.projects;
//     }

//     return this.projects.filter((project) => project.category === filter);
//   });

//   readonly whatsappUrl =
//     'https://wa.me/593963388467?text=Hola%2C%20deseo%20informaci%C3%B3n%20sobre%20sus%20servicios%20tecnol%C3%B3gicos.';

//   readonly services: readonly ServiceCard[] = [
//     {
//       title: 'Desarrollo Web',
//       summary: 'Landing pages, sitios corporativos y portales empresariales con SEO y conversión.',
//       items: ['Landing Pages', 'Sitios Corporativos', 'Portales Empresariales'],
//       accent: 'cyan',
//       icon: 'code'
//     },
//     {
//       title: 'Sistemas Empresariales',
//       summary: 'ERP, CRM, inventarios y facturación diseñados alrededor del proceso real.',
//       items: ['ERP', 'CRM', 'Inventarios', 'Facturación'],
//       accent: 'blue',
//       icon: 'business'
//     },
//     {
//       title: 'Comercio Electrónico',
//       summary: 'Tiendas online con pasarelas de pago, catálogos, logística e integraciones.',
//       items: ['Tiendas Online', 'Pasarelas de Pago', 'Integraciones'],
//       accent: 'green',
//       icon: 'commerce'
//     },
//     {
//       title: 'Automatización',
//       summary: 'Bots, integraciones y procesos automáticos para reducir trabajo operativo.',
//       items: ['Bots', 'Integraciones', 'Procesos Automáticos'],
//       accent: 'amber',
//       icon: 'bot'
//     },
//     {
//       title: 'Inteligencia Artificial',
//       summary: 'Chatbots, agentes IA y asistentes inteligentes conectados a datos del negocio.',
//       items: ['Chatbots', 'Agentes IA', 'Asistentes Inteligentes'],
//       accent: 'indigo',
//       icon: 'brain'
//     },
//     {
//       title: 'Consultoría Tecnológica',
//       summary: 'Arquitectura, migraciones, optimización y roadmap digital para escalar.',
//       items: ['Arquitectura', 'Migraciones', 'Optimización'],
//       accent: 'slate',
//       icon: 'cloud'
//     }
//   ];

//   readonly securityItems = [
//     'JWT',
//     'HTTPS',
//     'OWASP',
//     'SQL Injection Protection',
//     'XSS Protection',
//     'MFA',
//     'Encriptación',
//     'Auditoría'
//   ] as const;

//   readonly technologies = [
//     ['Angular', 'Avanzado'],
//     ['React', 'Avanzado'],
//     ['.NET', 'Avanzado'],
//     ['Spring Boot', 'Avanzado'],
//     ['SQL Server', 'Avanzado'],
//     ['Oracle', 'Avanzado'],
//     ['MySql', 'Avanzado'],
//     ['Azure', 'Cloud Ready'],
//     ['AWS', 'Cloud Ready'],
//     ['Docker', 'Producción'],
//     ['GitHub', 'CI/CD'],
//     ['OpenAI', 'IA aplicada'],
//     ['Tailwind', 'UI System'],
//     ['TypeScript', 'Strict'],
//     ['Redis', 'Performance'],
//     ['RabbitMQ', 'Mensajería'],
//   ] as const;

//   readonly portfolioFilters = ['Todos', 'Landing', 'CRM', 'ERP', 'E-commerce', 'Automatización', 'IA'] as const;

//   readonly projects: readonly ProjectCard[] = [
//     {
//       category: 'CRM',
//       name: 'Pipeline comercial B2B',
//       description: 'Prospectos, cotizaciones, seguimiento y KPIs para equipos de ventas.',
//       metric: '+150% velocidad de seguimiento'
//     },
//     {
//       category: 'ERP',
//       name: 'Operación financiera integrada',
//       description: 'Inventario, facturación y reportes gerenciales en una sola plataforma.',
//       metric: '-38% tareas manuales'
//     },
//     {
//       category: 'E-commerce',
//       name: 'Comercio omnicanal',
//       description: 'Catálogo, pagos, logística y automatización de clientes recurrentes.',
//       metric: '+300% conversión'
//     },
//     {
//       category: 'Landing',
//       name: 'Adquisición de leads premium',
//       description: 'Landing orientada a venta consultiva, velocidad y posicionamiento SEO.',
//       metric: '+220% leads calificados'
//     },
//     {
//       category: 'Automatización',
//       name: 'Backoffice automatizado',
//       description: 'Flujos con bots, integraciones y alertas operativas.',
//       metric: '+500% productividad'
//     },
//     {
//       category: 'IA',
//       name: 'Asistente inteligente interno',
//       description: 'Agente IA conectado a documentos, CRM y procesos de atención.',
//       metric: '-62% tiempo de respuesta'
//     }
//   ];

//   readonly successCases: readonly SuccessCase[] = [
//     {
//       company: 'Retail regional',
//       problem: 'Procesos de ventas dispersos y baja trazabilidad del cliente.',
//       solution: 'CRM con automatizaciones, cotizador y dashboard ejecutivo.',
//       result: 'Seguimiento comercial centralizado y decisiones con datos diarios.',
//       metric: '+300%'
//     },
//     {
//       company: 'Servicios B2B',
//       problem: 'Generación de prospectos sin priorización ni scoring.',
//       solution: 'Landing premium, lead scoring y pipeline consultivo.',
//       result: 'Mayor tasa de reuniones calificadas para el equipo comercial.',
//       metric: '+150%'
//     },
//     {
//       company: 'Operación logística',
//       problem: 'Inventario, facturación y reportes duplicados en hojas manuales.',
//       solution: 'Sistema empresarial con roles, auditoría y analítica operativa.',
//       result: 'Menos errores, cierres más rápidos y operación escalable.',
//       metric: '+500%'
//     }
//   ];

//   private readonly estimates: Record<ProjectKind, { min: number; max: number; timeline: string }> = {
//     Landing: { min: 250, max: 1500, timeline: '2 a 4 semanas' },
//     CRM: { min: 600, max: 8000, timeline: '6 a 10 semanas' },
//     'E-commerce': { min: 1000, max: 9500, timeline: '5 a 9 semanas' },
//     ERP: { min: 9000, max: 28000, timeline: '10 a 18 semanas' },
//     App: { min: 6500, max: 18000, timeline: '8 a 14 semanas' },
//     IA: { min: 3500, max: 14000, timeline: '4 a 12 semanas' }
//   };

//   ngAfterViewInit(): void {
//     this.updateFloatingNavVisibility();
//   }

//   @HostListener('window:scroll')
//   onWindowScroll(): void {
//     this.updateFloatingNavVisibility();
//   }

//   selectProject(project: ProjectKind): void {
//     this.selectedProject.set(project);
//   }

//   toggleModule(module: string): void {
//     const current = this.selectedModules();
//     const exists = current.includes(module);
//     const next = exists ? current.filter((item) => item !== module) : [...current, module];

//     this.selectedModules.set(next);
//   }

//   setPortfolioFilter(filter: ProjectKind | 'Automatización' | 'Todos'): void {
//     this.portfolioFilter.set(filter);
//   }

//   submitLead(): void {
//     if (this.leadForm.invalid) {
//       this.leadForm.markAllAsTouched();
//       this.submissionState.set('error');
//       return;
//     }

//     const form = this.leadForm.getRawValue();
//     this.submissionState.set('loading');

//     this.api
//       .createLead({
//         ...form,
//         projectType: this.selectedProject(),
//         estimatedInvestment: this.estimateLabel()
//       })
//       .subscribe({
//         next: () => this.submissionState.set('success'),
//         error: () => this.submissionState.set('offline')
//       });
//   }

//   isInvalid(field: keyof typeof this.leadForm.controls): boolean {
//     const control = this.leadForm.controls[field];

//     return control.invalid && (control.dirty || control.touched);
//   }

//   private formatMoney(value: number): string {
//     return value.toLocaleString('en-US');
//   }

//   private updateFloatingNavVisibility(): void {
//     if (typeof window === 'undefined') {
//       return;
//     }

//     this.floatingNavVisible.set(window.scrollY > 420);
//   }
// }


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
import { RouterLink } from '@angular/router';
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
  LucideUserRound,
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

interface ProjectEstimate {
  min: number;
  timeline: string;
  description: string;
}

interface ProjectFeature {
  name: string;
  price: number;
}

interface EstimateBreakdownItem {
  label: string;
  price: number;
}

@Component({
  selector: 'app-landing-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
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
    LucideUserRound,
    LucideXCircle
  ],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPage implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  /*
   * Precio comercial base.
   * Una Landing profesional incluye hasta 5 secciones por USD 230.
   * Los demás sistemas parten proporcionalmente de esta referencia,
   * pero sus funcionalidades adicionales se cotizan de forma individual.
   */
  private readonly BASE_LANDING_PRICE = 230;

  readonly projectTypes: readonly ProjectKind[] = [
    'Landing',
    'CRM',
    'E-commerce',
    'ERP',
    'App',
    'IA'
  ];

  // Landing es el producto de entrada y debe mostrarse seleccionado al cargar.
  readonly selectedProject = signal<ProjectKind>('Landing');

  /*
   * Se conserva el nombre selectedModules para mantener compatibilidad con
   * el HTML actual y con toggleModule(). Conceptualmente estos valores son
   * funcionalidades opcionales del proyecto.
   */
  readonly selectedModules = signal<readonly string[]>([]);

  readonly portfolioFilter = signal<ProjectKind | 'Automatización' | 'Todos'>('Todos');
  readonly submissionState = signal<SubmissionState>('idle');
  readonly floatingNavVisible = signal(false);

  readonly leadForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    company: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    email: ['', [Validators.required, Validators.email]],
    budgetRange: ['USD 230 - 500', Validators.required],
    message: [
      'Necesito digitalizar procesos comerciales con una solución segura y escalable.',
      [Validators.required, Validators.minLength(10)]
    ]
  });

  /*
   * Valores mínimos de entrada.
   *
   * Landing:       1.00 x USD 230 = USD 230
   * E-commerce:    3.50 x USD 230 = USD 805
   * IA:            4.00 x USD 230 = USD 920
   * CRM:           5.00 x USD 230 = USD 1,150
   * App:           7.25 x USD 230 = USD 1,668 aprox.
   * ERP:          10.00 x USD 230 = USD 2,300
   */
  private readonly estimates: Record<ProjectKind, ProjectEstimate> = {
    Landing: {
      min: this.BASE_LANDING_PRICE,
      timeline: '5 a 10 días',
      description: 'Landing profesional de hasta 5 secciones'
    },
    CRM: {
      min: Math.round(this.BASE_LANDING_PRICE * 5),
      timeline: '5 a 10 semanas',
      description: 'CRM empresarial base'
    },
    'E-commerce': {
      min: Math.round(this.BASE_LANDING_PRICE * 3.5),
      timeline: '4 a 8 semanas',
      description: 'Tienda online con catálogo y administración'
    },
    ERP: {
      min: Math.round(this.BASE_LANDING_PRICE * 10),
      timeline: '10 a 20 semanas',
      description: 'ERP empresarial base'
    },
    App: {
      min: Math.round(this.BASE_LANDING_PRICE * 7.25),
      timeline: '7 a 14 semanas',
      description: 'Aplicación móvil profesional'
    },
    IA: {
      min: Math.round(this.BASE_LANDING_PRICE * 4),
      timeline: '3 a 8 semanas',
      description: 'Solución inicial de inteligencia artificial'
    }
  };

  /*
   * Funcionalidades opcionales.
   * No existe un porcentaje genérico por módulo.
   * Cada funcionalidad tiene un valor acorde al trabajo adicional.
   */
  readonly projectFeatures: Record<ProjectKind, readonly ProjectFeature[]> = {
    Landing: [
      { name: 'CMS autoadministrable', price: 120 },
      { name: 'Multiidioma', price: 80 },
      { name: 'Blog', price: 100 },
      { name: 'Integración CRM', price: 120 },
      { name: 'Reserva de citas', price: 80 },
      { name: 'Pagos online', price: 150 }
    ],
    CRM: [
      { name: 'Cotizaciones', price: 180 },
      { name: 'Automatizaciones', price: 250 },
      { name: 'WhatsApp', price: 180 },
      { name: 'Reportería avanzada', price: 230 },
      { name: 'Firma electrónica', price: 300 },
      { name: 'IA comercial', price: 450 }
    ],
    'E-commerce': [
      { name: 'Pasarela de pagos', price: 180 },
      { name: 'Inventario', price: 250 },
      { name: 'Logística', price: 250 },
      { name: 'Facturación', price: 300 },
      { name: 'Integración CRM', price: 350 }
    ],
    ERP: [
      { name: 'Contabilidad', price: 600 },
      { name: 'Inventario', price: 450 },
      { name: 'Compras', price: 350 },
      { name: 'Ventas', price: 350 },
      { name: 'Tesorería', price: 500 },
      { name: 'Nómina', price: 600 },
      { name: 'Firma electrónica', price: 400 },
      { name: 'Reportería gerencial', price: 450 }
    ],
    App: [
      { name: 'Notificaciones Push', price: 180 },
      { name: 'Geolocalización', price: 280 },
      { name: 'Biometría', price: 280 },
      { name: 'Pagos', price: 350 },
      { name: 'Modo offline', price: 350 }
    ],
    IA: [
      { name: 'RAG documental', price: 300 },
      { name: 'Agente IA', price: 400 },
      { name: 'Integración CRM', price: 250 },
      { name: 'Automatización', price: 300 },
      { name: 'Base de conocimiento', price: 250 }
    ]
  };

  readonly availableFeatures = computed(
    () => this.projectFeatures[this.selectedProject()]
  );

  readonly selectedExtrasTotal = computed(() => {
    const selected = new Set(this.selectedModules());

    return this.availableFeatures()
      .filter((feature) => selected.has(feature.name))
      .reduce((total, feature) => total + feature.price, 0);
  });

  readonly estimateValue = computed(() => {
    const base = this.estimates[this.selectedProject()].min;
    return base + this.selectedExtrasTotal();
  });

  /*
   * Se mantiene estimateLabel porque ya forma parte del flujo existente:
   * - se muestra en la vista;
   * - se envía al backend como estimatedInvestment.
   */
  readonly estimateLabel = computed(
    () => `USD ${this.formatMoney(this.estimateValue())}`
  );

  readonly baseEstimateLabel = computed(
    () => `USD ${this.formatMoney(this.estimates[this.selectedProject()].min)}`
  );

  readonly estimateDescription = computed(
    () => this.estimates[this.selectedProject()].description
  );

  readonly estimatedTimeline = computed(
    () => this.estimates[this.selectedProject()].timeline
  );

  readonly estimateBreakdown = computed<readonly EstimateBreakdownItem[]>(() => {
    const project = this.selectedProject();
    const selected = new Set(this.selectedModules());

    const baseItem: EstimateBreakdownItem = {
      label: this.estimates[project].description,
      price: this.estimates[project].min
    };

    const extras = this.projectFeatures[project]
      .filter((feature) => selected.has(feature.name))
      .map((feature) => ({
        label: feature.name,
        price: feature.price
      }));

    return [baseItem, ...extras];
  });

  readonly filteredProjects = computed(() => {
    const filter = this.portfolioFilter();

    if (filter === 'Todos') {
      return this.projects;
    }

    return this.projects.filter((project) => project.category === filter);
  });

  /*
   * Se conserva como string para no romper un HTML existente que utilice
   * [href]="whatsappUrl". El presupuesto calculado continúa enviándose
   * mediante el formulario/API.
   */
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
    ['Flutter', 'Avanzado'],
    ['.NET', 'Avanzado'],
    ['Spring Boot', 'Avanzado'],
    ['Oracle', 'Avanzado'],
    ['SQL Server', 'Avanzado'],
    ['MySql', 'Avanzado'],
    ['Azure', 'Cloud Ready'],
    ['AWS', 'Cloud Ready'],
    ['Docker', 'Producción'],
    ['GitHub', 'CI/CD'],
    ['OpenAI', 'IA aplicada'],
    ['Tailwind', 'UI System'],
    ['TypeScript', 'Strict'],
    ['Redis', 'Performance'],
    ['RabbitMQ', 'Mensajería']
  ] as const;

  readonly portfolioFilters = [
    'Todos',
    'Landing',
    'CRM',
    'ERP',
    'E-commerce',
    'Automatización',
    'IA'
  ] as const;

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

  ngAfterViewInit(): void {
    this.updateFloatingNavVisibility();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateFloatingNavVisibility();
  }

  selectProject(project: ProjectKind): void {
    if (this.selectedProject() === project) {
      return;
    }

    this.selectedProject.set(project);

    // Evita arrastrar funcionalidades de un tipo de proyecto a otro.
    this.selectedModules.set([]);
  }

  toggleModule(module: string): void {
    const available = this.projectFeatures[this.selectedProject()];

    /*
     * Solo se permite seleccionar funcionalidades pertenecientes al
     * proyecto activo. Esto evita precios inconsistentes.
     */
    if (!available.some((feature) => feature.name === module)) {
      return;
    }

    const current = this.selectedModules();
    const exists = current.includes(module);

    const next = exists
      ? current.filter((item) => item !== module)
      : [...current, module];

    this.selectedModules.set(next);
  }

  isModuleSelected(module: string): boolean {
    return this.selectedModules().includes(module);
  }

  getFeaturePrice(module: string): number {
    return (
      this.projectFeatures[this.selectedProject()]
        .find((feature) => feature.name === module)
        ?.price ?? 0
    );
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
    const payload = {
      ...form,
      projectType: this.selectedProject(),
      estimatedInvestment: this.estimateLabel()
    };

    this.submissionState.set('loading');

    /*
     * Se conserva el contrato actual del backend.
     * No se agrega selectedFeatures aquí para no romper el DTO existente.
     */
    this.api
      .createLead(payload)
      .subscribe({
        next: () => this.submissionState.set('success'),
        error: () => {
          this.api.triggerLeadEmailFallback(payload);
          this.submissionState.set('success');
        }
      });
  }

  isInvalid(field: keyof typeof this.leadForm.controls): boolean {
    const control = this.leadForm.controls[field];

    return control.invalid && (control.dirty || control.touched);
  }

  public formatMoney(value: number): string {
    return value.toLocaleString('en-US');
  }

  private updateFloatingNavVisibility(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.floatingNavVisible.set(window.scrollY > 420);
  }
}