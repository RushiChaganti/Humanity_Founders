/**
 * API client for the Safety Form Engine backend
 */

import {
  FormSchema,
  FormSchemaCreate,
  FormSchemaUpdate,
  FormSubmission,
  FormSubmissionCreate,
  BranchesResponse,
} from '@/types/forms';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: response.statusText,
    }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

export const apiClient = {
  // Form Schema Endpoints
  async getForms(): Promise<FormSchema[]> {
    const response = await fetch(`${API_BASE}/api/forms`);
    return handleResponse(response);
  },

  async getForm(formId: string): Promise<FormSchema> {
    const response = await fetch(`${API_BASE}/api/forms/${formId}`);
    return handleResponse(response);
  },

  async createForm(formData: FormSchemaCreate): Promise<FormSchema> {
    const response = await fetch(`${API_BASE}/api/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async updateForm(
    formId: string,
    formData: FormSchemaUpdate
  ): Promise<FormSchema> {
    const response = await fetch(`${API_BASE}/api/forms/${formId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async createFormVersion(
    formId: string,
    formData: FormSchemaUpdate
  ): Promise<FormSchema> {
    const response = await fetch(`${API_BASE}/api/forms/${formId}/version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  async deleteForm(formId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/forms/${formId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: response.statusText,
      }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
  },

  async getFormBranches(formId: string): Promise<BranchesResponse> {

    const response = await fetch(`${API_BASE}/api/forms/${formId}/branches`);
    return handleResponse(response);
  },

  // Form Submission Endpoints
  async submitForm(
    submission: FormSubmissionCreate
  ): Promise<FormSubmission> {
    const response = await fetch(`${API_BASE}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    return handleResponse(response);
  },

  async getSubmission(submissionId: string): Promise<FormSubmission> {
    const response = await fetch(
      `${API_BASE}/api/submissions/${submissionId}`
    );
    return handleResponse(response);
  },

  async getFormSubmissions(
    formId: string
  ): Promise<{ form_id: string; count: number; submissions: FormSubmission[] }> {
    const response = await fetch(`${API_BASE}/api/forms/${formId}/submissions`);
    return handleResponse(response);
  },
};
