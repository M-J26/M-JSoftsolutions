import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';

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
  private readonly apiEnabled = this.isApiEnabled();

  createLead(payload: LeadPayload) {
    if (!this.apiEnabled) {
      return of({
        ...payload,
        id: 'local-offline',
        status: 'offline',
        createdAt: new Date().toISOString()
      } as LeadResponse);
    }

    return this.http.post<LeadResponse>(`${this.baseUrl}/leads`, payload);
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
