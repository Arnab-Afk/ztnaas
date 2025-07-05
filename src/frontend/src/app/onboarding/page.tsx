// Onboarding Page - ZTNaaS
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface SecurityFeatures {
  ddosProtection: boolean;
  threatIntelligence: boolean;
  analytics: boolean;
}

interface FormData {
  organization: {
    name: string;
    domain: string;
    adminEmail: string;
  };
  subscription: "starter" | "professional" | "enterprise";
  network: {
    name: string;
    primaryLocation: string;
    additionalLocations: string[];
  };
  security: {
    level: "strict" | "balanced" | "permissive";
    allowedDomains: string;
    features: SecurityFeatures;
  };
}

type FormSection = keyof FormData;

const steps = [
  { id: 0, title: "Organization Setup", description: "Set up your organization details" },
  { id: 1, title: "Subscription", description: "Choose your subscription plan" },
  { id: 2, title: "Network Setup", description: "Configure your initial network" },
  { id: 3, title: "Basic Policies", description: "Set up initial security policies" },
  { id: 4, title: "Review", description: "Review and complete setup" }
];

const subscriptionTiers = [
  { id: "starter", name: "Starter", price: "$15", features: "Basic Zero-Trust, 5 locations, Standard support" },
  { id: "professional", name: "Professional", price: "$35", features: "Full network management, Unlimited locations, Priority support" },
  { id: "enterprise", name: "Enterprise", price: "$65", features: "Advanced security, Compliance tools, Dedicated support" }
];

const cloudflareLocations = [
  "North America", "Europe", "Asia Pacific", "South America", "Africa"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / steps.length) * 100;
  const [formData, setFormData] = useState<FormData>({
    organization: {
      name: "",
      domain: "",
      adminEmail: "",
    },
    subscription: "professional",
    network: {
      name: "",
      primaryLocation: "",
      additionalLocations: [],
    },
    security: {
      level: "balanced",
      allowedDomains: "",
      features: {
        ddosProtection: true,
        threatIntelligence: false,
        analytics: false,
      },
    },
  });

  const updateFormData = <T extends FormSection>(section: T, data: Partial<FormData[T]>) => {
    setFormData((prev: FormData) => {
      // Create a copy of the previous form data
      const newFormData = { ...prev };
      
      // Type assertion to handle the nested object update
      const sectionData = newFormData[section] as Record<string, unknown>;
      
      // Update the section with new data
      newFormData[section] = { ...sectionData, ...data } as FormData[T];
      
      return newFormData;
    });
  };

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">{steps[step].title}</h1>
          <p className="text-muted-foreground mb-6 text-lg">{steps[step].description}</p>
          
          {/* Progress indicator */}
          <div className="mb-6">
            <Progress value={progress} className="h-2 w-full max-w-md mx-auto" />
            <div className="flex justify-center gap-2 mt-4">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === step ? "bg-primary" : i < step ? "bg-primary/25" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{steps[step].title}</CardTitle>
            <CardDescription>{steps[step].description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 0 && (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-blue-700">This information will be used to set up your organization's Zero-Trust Network. You can modify these details later from your dashboard.</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="org-name" className="text-sm font-medium">Organization Name</Label>
                    <span className="text-xs text-red-500">Required</span>
                  </div>
                  <Input 
                    id="org-name" 
                    required 
                    placeholder="Acme Corp" 
                    value={formData.organization.name}
                    onChange={(e) => updateFormData("organization", { name: e.target.value })}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">The name of your company or organization</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="org-domain" className="text-sm font-medium">Organization Domain</Label>
                    <span className="text-xs text-red-500">Required</span>
                  </div>
                  <Input 
                    id="org-domain" 
                    required 
                    placeholder="acme.com" 
                    value={formData.organization.domain}
                    onChange={(e) => updateFormData("organization", { domain: e.target.value })}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your primary domain for network access</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-email" className="text-sm font-medium">Admin Email</Label>
                    <span className="text-xs text-red-500">Required</span>
                  </div>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    required 
                    placeholder="admin@acme.com" 
                    value={formData.organization.adminEmail}
                    onChange={(e) => updateFormData("organization", { adminEmail: e.target.value })}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">The email address for the primary administrator</p>
                </div>
                
                <Button type="submit" className="w-full mt-6 h-11 text-base shadow-sm hover:shadow-md transition-all">
                  <span>Next: Choose Subscription</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </form>
            )}

            {step === 1 && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-blue-700">Choose the subscription plan that best fits your organization's needs. You can upgrade or downgrade your plan at any time.</p>
                  </div>
                </div>
                
                <RadioGroup
                  value={formData.subscription}
                  onValueChange={(value: FormData["subscription"]) => setFormData((prev) => ({ ...prev, subscription: value }))}
                  className="space-y-4"
                >
                  {subscriptionTiers.map((tier) => (
                    <div key={tier.id} className="flex">
                      <div className={`flex items-start space-x-3 border rounded-lg p-4 w-full transition-all ${formData.subscription === tier.id ? 'border-blue-400 bg-blue-50 shadow-sm' : 'hover:border-blue-200'}`}>
                        <RadioGroupItem value={tier.id} id={tier.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor={tier.id} className="text-base font-semibold block">
                              {tier.name}
                            </Label>
                            <span className="text-lg font-bold text-blue-600">{tier.price}<span className="text-sm font-normal">/user/month</span></span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{tier.features}</p>
                          
                          {tier.id === "starter" && (
                            <div className="bg-gray-100 rounded-md p-2 text-xs text-gray-600">
                              <span className="font-medium">Best for:</span> Small teams getting started with Zero-Trust
                            </div>
                          )}
                          
                          {tier.id === "professional" && (
                            <div className="bg-blue-100 rounded-md p-2 text-xs text-blue-700">
                              <span className="font-medium">Best for:</span> Growing organizations with multiple locations
                            </div>
                          )}
                          
                          {tier.id === "enterprise" && (
                            <div className="bg-indigo-100 rounded-md p-2 text-xs text-indigo-700">
                              <span className="font-medium">Best for:</span> Large enterprises with advanced security needs
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                
                <Button type="submit" className="w-full mt-6 h-11 text-base shadow-sm hover:shadow-md transition-all">
                  <span>Next: Network Setup</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Network Configuration</p>
                      <p className="text-xs text-blue-600 mt-1">Configure your Zero-Trust Network with global edge locations powered by Cloudflare's infrastructure.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="network-name" className="text-sm font-medium">Network Name</Label>
                    <span className="text-xs text-red-500">Required</span>
                  </div>
                  <Input 
                    id="network-name" 
                    required 
                    placeholder="HQ Network" 
                    value={formData.network.name}
                    onChange={(e) => updateFormData("network", { name: e.target.value })}
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">A descriptive name for your Zero-Trust Network</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="primary-location" className="text-sm font-medium">Primary Location</Label>
                    <span className="text-xs text-red-500">Required</span>
                  </div>
                  <Select 
                    value={formData.network.primaryLocation}
                    onValueChange={(value) => updateFormData("network", { primaryLocation: value })}
                  >
                    <SelectTrigger id="primary-location" className="h-10">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {cloudflareLocations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">The main geographic region where your network will be deployed</p>
                </div>
                
                <div className="space-y-2 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor="additional-locations" className="text-sm font-medium">Additional Locations</Label>
                      <div className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Optional</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {cloudflareLocations
                        .filter(location => location !== formData.network.primaryLocation) // Filter out primary location
                        .map((location) => (
                          <div key={location} className={`flex items-center space-x-2 p-2 rounded-md ${formData.network.additionalLocations.includes(location) ? 'bg-purple-50 border border-purple-100' : ''}`}>
                            <Checkbox 
                              id={`location-${location}`}
                              checked={formData.network.additionalLocations.includes(location)}
                              onCheckedChange={(checked) => {
                                const currentLocations = [...formData.network.additionalLocations];
                                if (checked) {
                                  if (!currentLocations.includes(location)) {
                                    currentLocations.push(location);
                                  }
                                } else {
                                  const index = currentLocations.indexOf(location);
                                  if (index !== -1) {
                                    currentLocations.splice(index, 1);
                                  }
                                }
                                updateFormData("network", { additionalLocations: currentLocations });
                              }}
                              className="text-purple-600"
                            />
                            <Label htmlFor={`location-${location}`} className="text-sm">{location}</Label>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex items-start mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-gray-500">Select additional locations where your network will be deployed. This improves performance and redundancy.</p>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-6 h-11 text-base shadow-sm hover:shadow-md transition-all">
                  <span>Next: Security Policies</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </form>
            )}

            {step === 3 && (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-md mb-6 shadow-sm">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm text-slate-800 font-semibold">Security Configuration</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">Configure enterprise-grade security policies and features for your Zero-Trust Network infrastructure.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security-level" className="text-sm font-medium">Default Security Level</Label>
                    <span className="text-xs text-red-500">Required</span>
                  </div>
                  <Select 
                    value={formData.security.level}
                    onValueChange={(value: "strict" | "balanced" | "permissive") => 
                      updateFormData("security", { level: value })
                    }
                  >
                    <SelectTrigger id="security-level" className="h-10">
                      <SelectValue placeholder="Select security level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">Strict</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="permissive">Permissive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className={`p-3 rounded-md border shadow-sm transition-all ${formData.security.level === 'strict' ? 'bg-slate-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${formData.security.level === 'strict' ? 'text-indigo-600' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <p className={`font-medium text-sm ${formData.security.level === 'strict' ? 'text-indigo-700' : 'text-slate-700'}`}>Strict</p>
                      </div>
                      <p className={`text-xs leading-relaxed ${formData.security.level === 'strict' ? 'text-indigo-600' : 'text-slate-500'}`}>Maximum security posture for sensitive environments and regulated industries</p>
                    </div>
                    <div className={`p-3 rounded-md border shadow-sm transition-all ${formData.security.level === 'balanced' ? 'bg-slate-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${formData.security.level === 'balanced' ? 'text-indigo-600' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        <p className={`font-medium text-sm ${formData.security.level === 'balanced' ? 'text-indigo-700' : 'text-slate-700'}`}>Balanced</p>
                      </div>
                      <p className={`text-xs leading-relaxed ${formData.security.level === 'balanced' ? 'text-indigo-600' : 'text-slate-500'}`}>Recommended for most enterprise environments with standard security requirements</p>
                    </div>
                    <div className={`p-3 rounded-md border shadow-sm transition-all ${formData.security.level === 'permissive' ? 'bg-slate-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${formData.security.level === 'permissive' ? 'text-indigo-600' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                        </svg>
                        <p className={`font-medium text-sm ${formData.security.level === 'permissive' ? 'text-indigo-700' : 'text-slate-700'}`}>Permissive</p>
                      </div>
                      <p className={`text-xs leading-relaxed ${formData.security.level === 'permissive' ? 'text-indigo-600' : 'text-slate-500'}`}>Minimal security controls for development environments or non-critical systems</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor="allowed-domains" className="text-sm font-medium text-slate-800">Allowed Domains</Label>
                      <div className="ml-2 bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md border border-slate-200">Optional</div>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-slate-500">Enterprise Feature</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Input 
                      id="allowed-domains" 
                      placeholder="example.com, internal.net" 
                      value={formData.security.allowedDomains}
                      onChange={(e) => updateFormData("security", { allowedDomains: e.target.value })}
                      className="h-10 pl-10 border-slate-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="flex items-start mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 mt-0.5 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-slate-600 leading-relaxed">Specify a comma-separated list of domains that will be allowed through your Zero-Trust Network. This enables granular access control for your organization's resources.</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <Label className="text-sm font-semibold text-slate-800">Enterprise Security Features</Label>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-md border border-indigo-100">
                      Recommended
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className={`flex items-start p-4 rounded-md border shadow-sm transition-all ${formData.security.features.ddosProtection ? 'bg-slate-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex-shrink-0 mt-0.5">
                        <Checkbox 
                          id="ddos-protection" 
                          checked={formData.security.features.ddosProtection}
                          onCheckedChange={(checked: boolean) => {
                            const updatedFeatures: SecurityFeatures = {
                              ...formData.security.features,
                              ddosProtection: checked
                            };
                            updateFormData("security", { features: updatedFeatures });
                          }}
                          className={`h-5 w-5 ${formData.security.features.ddosProtection ? 'text-indigo-600' : 'text-slate-300'}`}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="ddos-protection" className={`text-sm font-medium ${formData.security.features.ddosProtection ? 'text-indigo-700' : 'text-slate-700'}`}>Advanced DDoS Protection</Label>
                          <div className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md border border-slate-200">
                            Enterprise
                          </div>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${formData.security.features.ddosProtection ? 'text-indigo-600' : 'text-slate-500'}`}>Protect your network infrastructure from sophisticated Distributed Denial of Service attacks with our enterprise-grade mitigation system</p>
                        <div className="mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-slate-500">Includes volumetric, protocol, and application layer protection</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-start p-4 rounded-md border shadow-sm transition-all ${formData.security.features.threatIntelligence ? 'bg-slate-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex-shrink-0 mt-0.5">
                        <Checkbox 
                          id="threat-intelligence" 
                          checked={formData.security.features.threatIntelligence}
                          onCheckedChange={(checked: boolean) => {
                            const updatedFeatures: SecurityFeatures = {
                              ...formData.security.features,
                              threatIntelligence: checked
                            };
                            updateFormData("security", { features: updatedFeatures });
                          }}
                          className={`h-5 w-5 ${formData.security.features.threatIntelligence ? 'text-indigo-600' : 'text-slate-300'}`}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="threat-intelligence" className={`text-sm font-medium ${formData.security.features.threatIntelligence ? 'text-indigo-700' : 'text-slate-700'}`}>Global Threat Intelligence</Label>
                          <div className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md border border-slate-200">
                            Premium
                          </div>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${formData.security.features.threatIntelligence ? 'text-indigo-600' : 'text-slate-500'}`}>Leverage our continuously updated global threat database to automatically block traffic from known malicious sources and threat actors</p>
                        <div className="mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                          </svg>
                          <span className="text-xs text-slate-500">Updated every 15 minutes with the latest threat intelligence</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-start p-4 rounded-md border shadow-sm transition-all ${formData.security.features.analytics ? 'bg-slate-50 border-indigo-300 ring-1 ring-indigo-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex-shrink-0 mt-0.5">
                        <Checkbox 
                          id="analytics" 
                          checked={formData.security.features.analytics}
                          onCheckedChange={(checked: boolean) => {
                            const updatedFeatures: SecurityFeatures = {
                              ...formData.security.features,
                              analytics: checked
                            };
                            updateFormData("security", { features: updatedFeatures });
                          }}
                          className={`h-5 w-5 ${formData.security.features.analytics ? 'text-indigo-600' : 'text-slate-300'}`}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="analytics" className={`text-sm font-medium ${formData.security.features.analytics ? 'text-indigo-700' : 'text-slate-700'}`}>Advanced Security Analytics</Label>
                          <div className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md border border-slate-200">
                            Business
                          </div>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${formData.security.features.analytics ? 'text-indigo-600' : 'text-slate-500'}`}>Gain comprehensive visibility into your security posture with detailed analytics, custom reports, and real-time monitoring dashboards</p>
                        <div className="mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-slate-500">Includes customizable reports and compliance documentation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-md mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-slate-600">Your security configuration is almost complete. Proceed to review your Zero-Trust Network setup before deployment.</p>
                  </div>
                  
                  <Button type="submit" className="w-full h-12 text-base font-medium bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all">
                    <span>Review Enterprise Configuration</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-2">Your Zero-Trust Network</h2>
                <p className="text-center text-gray-600 mb-6">Review your configuration before deployment</p>
                
                {/* Organization Card */}
                <div className="border rounded-lg p-5 bg-blue-50 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-md text-blue-800">Organization Details</h3>
                  </div>
                  <div className="ml-10">
                    <p className="font-medium text-lg text-blue-900">{formData.organization.name}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-white/50 p-3 rounded-md">
                        <p className="text-xs text-blue-600 uppercase font-semibold">Domain</p>
                        <p className="text-sm text-blue-800 font-medium">{formData.organization.domain}</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded-md">
                        <p className="text-xs text-blue-600 uppercase font-semibold">Admin Contact</p>
                        <p className="text-sm text-blue-800 font-medium">{formData.organization.adminEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subscription Card */}
                <div className="border rounded-lg p-5 bg-green-50 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-md text-green-800">Subscription Plan</h3>
                  </div>
                  <div className="ml-10">
                    <div className="flex items-center justify-between bg-white/50 p-3 rounded-md mb-3">
                      <p className="font-medium text-lg text-green-900">{subscriptionTiers.find(t => t.id === formData.subscription)?.name} Plan</p>
                      <p className="font-bold text-lg text-green-700">{subscriptionTiers.find(t => t.id === formData.subscription)?.price}<span className="text-sm font-normal">/user/month</span></p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-md">
                      <p className="text-xs text-green-700 uppercase font-semibold mb-1">Included Features</p>
                      <p className="text-sm text-green-800">{subscriptionTiers.find(t => t.id === formData.subscription)?.features}</p>
                    </div>
                  </div>
                </div>
                
                {/* Network Card */}
                <div className="border rounded-lg p-5 bg-purple-50 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-md text-purple-800">Network Configuration</h3>
                  </div>
                  <div className="ml-10">
                    <p className="font-medium text-lg text-purple-900 bg-white/50 p-3 rounded-md mb-3">{formData.network.name}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-100 p-3 rounded-md">
                        <div className="flex items-center mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <p className="text-xs text-purple-700 uppercase font-semibold">Primary Location</p>
                        </div>
                        <p className="text-sm font-medium text-purple-900">{formData.network.primaryLocation}</p>
                      </div>
                      
                      <div className="bg-purple-100 p-3 rounded-md">
                        <div className="flex items-center mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-700" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                          <p className="text-xs text-purple-700 uppercase font-semibold">Additional Locations</p>
                        </div>
                        {formData.network.additionalLocations.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.network.additionalLocations.map(location => (
                              <span key={location} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">{location}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-purple-700">None selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Security Card */}
                <div className="border rounded-lg p-5 bg-red-50 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-md text-red-800">Security Configuration</h3>
                  </div>
                  <div className="ml-10">
                    <div className="bg-white/50 p-3 rounded-md mb-3">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-red-700 uppercase font-semibold">Security Level</p>
                      </div>
                      <p className="font-medium text-md text-red-900 capitalize mt-1">{formData.security.level}</p>
                    </div>
                    
                    {formData.security.allowedDomains && (
                      <div className="bg-white/50 p-3 rounded-md mb-3">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                          </svg>
                          <p className="text-xs text-red-700 uppercase font-semibold">Allowed Domains</p>
                        </div>
                        <p className="text-sm text-red-900 font-mono mt-1 bg-red-100/50 p-2 rounded">{formData.security.allowedDomains}</p>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <p className="text-xs text-red-700 uppercase font-semibold">Security Features</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(formData.security.features)
                          .map(([feature, enabled]) => (
                            <div 
                              key={feature} 
                              className={`text-sm px-3 py-2 rounded-md flex items-center ${enabled ? 'bg-red-200 text-red-900' : 'bg-gray-100 text-gray-500'}`}
                            >
                              {enabled ? (
                                <svg className="h-4 w-4 mr-1 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Your Zero-Trust Network is ready to be deployed!</p>
                        <p className="text-xs text-blue-700 mt-1">Once deployed, you can manage your network from the dashboard and make additional configuration changes as needed.</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.location.href = "/dashboard"} 
                    className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    Complete Setup & Deploy Network
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          {step === 0 && <div></div>}
          
          <div className="flex space-x-3">
            {/* Quick Setup button - only on first step */}
            {step === 0 && (
              <Button
                variant="secondary"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                onClick={() => {
                  // Quick setup - set default values and go to review
                  setFormData({
                    organization: {
                      name: "My Organization",
                      domain: "myorg.com",
                      adminEmail: "admin@myorg.com",
                    },
                    subscription: "professional",
                    network: {
                      name: "Main Network",
                      primaryLocation: "North America",
                      additionalLocations: ["Europe"],
                    },
                    security: {
                      level: "balanced",
                      allowedDomains: "*.myorg.com, *.trusted-partner.com",
                      features: {
                        ddosProtection: true,
                        threatIntelligence: true,
                        analytics: true,
                      },
                    },
                  });
                  setStep(4); // Jump to review
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Setup
              </Button>
            )}
            
            {/* Skip/Continue button - for steps 1-3 */}
            {step > 0 && step < 4 && (
              <Button
                variant="ghost"
                onClick={() => setStep(step + 1)}
              >
                Save & Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
