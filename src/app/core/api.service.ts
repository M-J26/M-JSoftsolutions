import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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
  private readonly baseUrl = '/api';

  createLead(payload: LeadPayload) {
    return this.http.post<LeadResponse>(`${this.baseUrl}/leads`, payload);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password });
  }

  dashboard(token: string) {
    return this.http.get<DashboardKpi>(`${this.baseUrl}/dashboard/kpis`, {
      headers: this.authHeaders(token)
    });
  }

  prospects(token: string) {
    return this.http.get<LeadResponse[]>(`${this.baseUrl}/crm/prospects`, {
      headers: this.authHeaders(token)
    });
  }

  private authHeaders(token: string) {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
