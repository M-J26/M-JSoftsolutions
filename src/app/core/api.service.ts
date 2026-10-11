import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';

export type ProjectKind = 'Landing' | 'CRM' | 'E-commerce' | 'ERP' | 'App' | 'IA';

export interface LeadPayload {
  name: string;
  company: string;
  phone: string;
  email: string;
  projectType: ProjectKind;
  budgetRange: string;
  message: string;
  estimatedInvestment: string;
}

export interface LeadResponse extends LeadPayload {
  id: string;
  status: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  email: string;
  role: string;
}

export interface DashboardKpi {
  activeProspects: number;
  qualifiedPipeline: number;
  conversionRate: number;
  averageTicket: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly runtimeApiUrl = this.resolveRuntimeApiUrl();
  private readonly baseUrl = this.runtimeApiUrl ?? '/api';
  private readonly apiEnabled = this.isApiEnabled() && this.isApiFeatureEnabled();
  private readonly emailFallbackEnabled = true;
  private readonly emailJsConfig = this.resolveEmailJsConfig();
  readonly fallbackRecipientEmail = 'jeffer.mio@gmail.com';

  createLead(payload: LeadPayload) {
    if (!this.apiEnabled) {
      return this.sendLeadDirectly(payload);
    }

    return this.http.post<LeadResponse>(`${this.baseUrl}/leads`, payload).pipe(
      catchError(() => this.sendLeadDirectly(payload))
    );
  }

  sendLeadDirectly(payload: LeadPayload) {
    if (this.emailJsConfig.isConfigured) {
      return this.http
        .post<{ status: string }>('https://api.emailjs.com/api/v1.0/email/send', {
          service_id: this.emailJsConfig.serviceId,
          template_id: this.emailJsConfig.templateId,
          user_id: this.emailJsConfig.publicKey,
          template_params: {
            to_email: this.fallbackRecipientEmail,
            from_name: payload.name,
            company: payload.company,
            phone: payload.phone,
            email: payload.email,
            project_type: payload.projectType,
            budget_range: payload.budgetRange,
            estimated_investment: payload.estimatedInvestment,
            message: payload.message,
            subject: `Nuevo lead: ${payload.name} - ${payload.company}`
          }
        })
        .pipe(
          catchError(() => {
            this.triggerLeadEmailFallback(payload);
            return of({
              ...payload,
              id: 'local-offline',
              status: 'offline',
              createdAt: new Date().toISOString()
            } as LeadResponse);
          })
        );
    }

    this.triggerLeadEmailFallback(payload);

    return of({
      ...payload,
      id: 'local-offline',
      status: 'offline',
      createdAt: new Date().toISOString()
    } as LeadResponse);
  }

  buildLeadEmailLink(payload: LeadPayload): string {
    const subject = `Nuevo lead: ${payload.name} - ${payload.company}`;
    const bodyLines = [
      'Nuevo lead recibido desde la landing.',
      '',
      `Nombre: ${payload.name}`,
      `Empresa: ${payload.company}`,
      `Teléfono: ${payload.phone}`,
      `Correo del cliente: ${payload.email}`,
      `Tipo de proyecto: ${payload.projectType}`,
      `Presupuesto: ${payload.budgetRange}`,
      `Inversión estimada: ${payload.estimatedInvestment}`,
      '',
      'Mensaje del cliente:',
      payload.message
    ];

    const mailtoBody = encodeURIComponent(bodyLines.join('\n'));
    const mailtoSubject = encodeURIComponent(subject);

    return `mailto:${this.fallbackRecipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
  }

  triggerLeadEmailFallback(payload: LeadPayload): void {
    if (!this.emailFallbackEnabled || typeof window === 'undefined') {
      return;
    }

    const mailLink = this.buildLeadEmailLink(payload);
    window.location.href = mailLink;
  }

  login(email: string, password: string) {
    if (!this.apiEnabled) {
      return of({
        accessToken: 'offline-token',
        refreshToken: 'offline-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        email,
        role: 'offline'
      } as AuthResponse);
    }

    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password });
  }

  dashboard(token: string) {
    if (!this.apiEnabled) {
      return of({
        activeProspects: 0,
        qualifiedPipeline: 0,
        conversionRate: 0,
        averageTicket: 0
      } as DashboardKpi);
    }

    return this.http.get<DashboardKpi>(`${this.baseUrl}/dashboard/kpis`, {
      headers: this.authHeaders(token)
    });
  }

  prospects(token: string) {
    if (!this.apiEnabled) {
      return of([] as LeadResponse[]);
    }

    return this.http.get<LeadResponse[]>(`${this.baseUrl}/crm/prospects`, {
      headers: this.authHeaders(token)
    });
  }

  private authHeaders(token: string) {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private resolveRuntimeApiUrl(): string | undefined {
    const runtimeApiUrl = (globalThis as typeof globalThis & {
      __MJS_API_URL__?: string;
    }).__MJS_API_URL__;

    return runtimeApiUrl && runtimeApiUrl.trim() ? runtimeApiUrl.trim() : undefined;
  }

  private resolveEmailJsConfig() {
    const emailJsServiceId = (globalThis as typeof globalThis & {
      __EMAILJS_SERVICE_ID__?: string;
    }).__EMAILJS_SERVICE_ID__;
    const emailJsTemplateId = (globalThis as typeof globalThis & {
      __EMAILJS_TEMPLATE_ID__?: string;
    }).__EMAILJS_TEMPLATE_ID__;
    const emailJsPublicKey = (globalThis as typeof globalThis & {
      __EMAILJS_PUBLIC_KEY__?: string;
    }).__EMAILJS_PUBLIC_KEY__;

    const serviceId = emailJsServiceId ?? '';
    const templateId = emailJsTemplateId ?? '';
    const publicKey = emailJsPublicKey ?? '';

    return {
      serviceId,
      templateId,
      publicKey,
      isConfigured: Boolean(serviceId && templateId && publicKey)
    };
  }

  private isApiFeatureEnabled(): boolean {
    const runtimeApiEnabled = (globalThis as typeof globalThis & {
      __MJS_API_ENABLED__?: boolean;
    }).__MJS_API_ENABLED__;

    if (typeof runtimeApiEnabled === 'boolean') {
      return runtimeApiEnabled;
    }

    if (typeof window === 'undefined') {
      return true;
    }

    const storedFlag = window.localStorage.getItem('MJS_API_ENABLED');
    if (storedFlag !== null) {
      return storedFlag === 'true';
    }

    return true;
  }

  private isApiEnabled(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const hostname = window.location.hostname;
    const runtimeApiUrl = this.resolveRuntimeApiUrl();

    if (runtimeApiUrl) {
      return true;
    }

    return hostname === 'localhost' || hostname === '127.0.0.1';
  }
}
