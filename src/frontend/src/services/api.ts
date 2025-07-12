
import axios from 'axios';

const API_URL = 'https://ztnaasb.arnabbhowmik019.workers.dev';

const api = axios.create({
  baseURL: API_URL,
});

// Function to get a cookie by name
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Add a request interceptor to include the Cloudflare Access token
api.interceptors.request.use(
  (config) => {
    const token = getCookie('CF_Authorization');
    if (token) {
      config.headers['Cf-Access-Jwt-Assertion'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getOrganizations = () => api.get('/organizations');
export const getNetworks = (orgId: string) => api.get(`/organizations/${orgId}/networks`);
export const createNetwork = (orgId: string, networkData: any) => api.post(`/organizations/${orgId}/networks`, networkData);
export const getPolicies = (networkId: string) => api.get(`/networks/${networkId}/policies`);
export const createPolicy = (networkId: string, policyData: any) => api.post(`/networks/${networkId}/policies`, policyData);
