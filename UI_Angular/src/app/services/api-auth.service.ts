import { Injectable } from '@angular/core';
import axios from 'axios';
import { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private axiosInstance = axios.create({
    baseURL: 'http://localhost:5242'
  });

  private userProfile: string | undefined;

  constructor() {
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        } as AxiosRequestHeaders;
      }
      return config;
    });
  }


  setUserProfile(profile: string) {
    this.userProfile = profile;
  }

  getUserProfile(): string | undefined {
    return this.userProfile;
  }

  async login(user: any): Promise<any> {
    try {
      const apiUrl = '/Login/Login';
      const response = await this.axiosInstance.post(apiUrl, user);
      console.log('Response:', response);
      localStorage.setItem('token', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
}
