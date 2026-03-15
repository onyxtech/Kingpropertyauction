import { ArrowRight, Database, Server, Globe, Shield, Upload, Users, FileText, Briefcase, CheckSquare, FileSpreadsheet, Settings, Lock, FileCheck, Zap, GitBranch, AlertCircle, Eye, Building2, Gavel, TrendingUp, UserCheck, CreditCard, BrainCircuit, DollarSign, Send, Bell, BarChart3, Menu, Mail, Smartphone, Map, Video } from 'lucide-react';

export default function SystemArchitecture() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">System Architecture</h1>
          <p className="text-slate-600 text-lg">Full-Stack Web Application - Enterprise SaaS Platform</p>
          <div className="flex items-center justify-center gap-8 mt-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Frontend Layer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Backend Layer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
              <span>Database & Services</span>
            </div>
          </div>
        </div>

        {/* Main Architecture Diagram */}
        <div className="space-y-8">
          
          {/* Frontend Layer */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Frontend Layer</h2>
                <p className="text-sm text-slate-500">Next.js + TypeScript</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Interface */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  User Interface
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Dashboard UI</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Form Pages</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Data Tables</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Modal Dialogs</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Notifications</div>
                </div>
              </div>

              {/* State & Services */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  State & Services
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">API Service Layer</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Auth State Manager</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Form Validation</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Error Handling</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Loading States</div>
                </div>
              </div>

              {/* TypeScript Types */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  TypeScript Types
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">API Response Types</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Form Data Types</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">User Models</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Business Entities</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">Enum Definitions</div>
                </div>
              </div>
            </div>

            {/* Technical Labels */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">JWT Token Handling</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Client-side Validation</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">SSR/CSR Hybrid</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">API Response Caching</span>
            </div>
          </div>

          {/* Data Flow Arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
              <span className="text-sm text-slate-500 mt-2">REST API Calls</span>
            </div>
          </div>

          {/* Backend Layer */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Backend Layer</h2>
                <p className="text-sm text-slate-500">Node.js + TypeScript + Express</p>
              </div>
            </div>

            {/* Middleware Layer */}
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-600" />
                Middleware Layer
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="bg-white rounded-lg px-3 py-2 border border-purple-200 text-center">
                  <Lock className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  Auth Verification
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-purple-200 text-center">
                  <FileCheck className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  Request Validation
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-purple-200 text-center">
                  <AlertCircle className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  Error Handler
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-purple-200 text-center">
                  <FileText className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  Request Logger
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-purple-200 text-center">
                  <Shield className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  RBAC Guard
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controllers */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h3 className="font-semibold text-slate-800 mb-4">Controllers</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Route Handlers</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Request Parsing</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Response Formatting</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">HTTP Status Codes</div>
                </div>
              </div>

              {/* Services */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h3 className="font-semibold text-slate-800 mb-4">Business Logic</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Service Layer</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Business Rules</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Data Processing</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Calculations</div>
                </div>
              </div>

              {/* Repositories */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h3 className="font-semibold text-slate-800 mb-4">Data Access</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Repository Pattern</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">CRUD Operations</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Query Builder</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Transactions</div>
                </div>
              </div>

              {/* Validation */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h3 className="font-semibold text-slate-800 mb-4">Validation</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Schema Validation</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Data Sanitization</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Type Checking</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-purple-200">Business Rules</div>
                </div>
              </div>
            </div>

            {/* API Endpoints by Module */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="font-semibold text-slate-800 mb-6 text-xl">REST API Endpoints - Organized by Platform</h3>
              
              {/* ADMIN DASHBOARD APIs */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-indigo-300">
                  <Settings className="w-6 h-6 text-indigo-600" />
                  <h4 className="font-bold text-slate-800 text-lg">Admin Dashboard APIs</h4>
                  <span className="ml-auto text-xs text-slate-600 bg-indigo-100 px-3 py-1 rounded-full">Protected - Admin Only</span>
                </div>

                {/* Page Builder - Featured */}
                <div className="mb-6 bg-white rounded-xl p-5 border-2 border-purple-300 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">Page Builder API</h4>
                      <p className="text-xs text-slate-600">Complete CMS with drag-drop components</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg px-3 py-2 border border-blue-200">
                      <div className="font-bold text-blue-700">GET /api/pages</div>
                      <div className="text-slate-600">List all pages</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg px-3 py-2 border border-green-200">
                      <div className="font-bold text-green-700">POST /api/pages</div>
                      <div className="text-slate-600">Create new page</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg px-3 py-2 border border-amber-200">
                      <div className="font-bold text-amber-700">PUT /api/pages/:id</div>
                      <div className="text-slate-600">Update page</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg px-3 py-2 border border-red-200">
                      <div className="font-bold text-red-700">DELETE /api/pages/:id</div>
                      <div className="text-slate-600">Delete page</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg px-3 py-2 border border-purple-200">
                      <div className="font-bold text-purple-700">GET /api/pages/:id</div>
                      <div className="text-slate-600">Get page details</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg px-3 py-2 border border-indigo-200">
                      <div className="font-bold text-indigo-700">POST /api/pages/:id/publish</div>
                      <div className="text-slate-600">Publish page</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg px-3 py-2 border border-cyan-200">
                      <div className="font-bold text-cyan-700">GET /api/pages/templates</div>
                      <div className="text-slate-600">Get templates</div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg px-3 py-2 border border-teal-200">
                      <div className="font-bold text-teal-700">POST /api/pages/:id/duplicate</div>
                      <div className="text-slate-600">Duplicate page</div>
                    </div>
                  </div>
                </div>

                {/* Menu Manager - Featured */}
                <div className="mb-6 bg-white rounded-xl p-5 border-2 border-cyan-300 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <Menu className="w-6 h-6 text-cyan-600" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">Menu Manager API</h4>
                      <p className="text-xs text-slate-600">Navigation management with drag-drop items</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg px-3 py-2 border border-blue-200">
                      <div className="font-bold text-blue-700">GET /api/menus</div>
                      <div className="text-slate-600">List all menus</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg px-3 py-2 border border-green-200">
                      <div className="font-bold text-green-700">POST /api/menus</div>
                      <div className="text-slate-600">Create new menu</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg px-3 py-2 border border-amber-200">
                      <div className="font-bold text-amber-700">PUT /api/menus/:id</div>
                      <div className="text-slate-600">Update menu</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg px-3 py-2 border border-red-200">
                      <div className="font-bold text-red-700">DELETE /api/menus/:id</div>
                      <div className="text-slate-600">Delete menu</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg px-3 py-2 border border-purple-200">
                      <div className="font-bold text-purple-700">GET /api/menus/:id</div>
                      <div className="text-slate-600">Get menu details</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg px-3 py-2 border border-indigo-200">
                      <div className="font-bold text-indigo-700">PUT /api/menus/:id/items</div>
                      <div className="text-slate-600">Update menu items</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg px-3 py-2 border border-cyan-200">
                      <div className="font-bold text-cyan-700">POST /api/menus/:id/activate</div>
                      <div className="text-slate-600">Activate menu</div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg px-3 py-2 border border-teal-200">
                      <div className="font-bold text-teal-700">POST /api/menus/:id/duplicate</div>
                      <div className="text-slate-600">Duplicate menu</div>
                    </div>
                  </div>
                </div>

                {/* Other Admin APIs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { name: 'Property Mgmt', icon: Building2, path: '/admin/properties' },
                    { name: 'Auction Mgmt', icon: Gavel, path: '/admin/auctions' },
                    { name: 'User Mgmt', icon: Users, path: '/admin/users' },
                    { name: 'Agent Mgmt', icon: UserCheck, path: '/admin/agents' },
                    { name: 'Marketing Hub', icon: Send, path: '/admin/campaigns' },
                    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
                    { name: 'Financial Mgmt', icon: CreditCard, path: '/admin/payments' },
                    { name: 'Legal/KYC', icon: Shield, path: '/admin/kyc' },
                    { name: 'Media Library', icon: Upload, path: '/admin/media' },
                    { name: 'Settings', icon: Settings, path: '/admin/settings' },
                  ].map((module) => (
                    <div key={module.name} className="bg-white rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <module.icon className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-sm">{module.name}</span>
                      </div>
                      <div className="text-xs text-slate-600">CRUD Operations</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WEBSITE APIs */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-300">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <h4 className="font-bold text-slate-800 text-lg">Website (Public) APIs</h4>
                  <span className="ml-auto text-xs text-slate-600 bg-blue-100 px-3 py-1 rounded-full">Public + Authenticated</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { name: 'Properties', icon: Building2, desc: 'Browse listings', methods: 'GET, POST' },
                    { name: 'Auctions', icon: Gavel, desc: 'View auctions', methods: 'GET' },
                    { name: 'Bids', icon: TrendingUp, desc: 'Place bids', methods: 'GET, POST' },
                    { name: 'Valuations', icon: BrainCircuit, desc: 'AI valuation', methods: 'POST' },
                    { name: 'Mortgages', icon: DollarSign, desc: 'Calculate finance', methods: 'POST' },
                    { name: 'Contact Forms', icon: Mail, desc: 'Submit inquiries', methods: 'POST' },
                    { name: 'Alerts', icon: Bell, desc: 'Property alerts', methods: 'GET, POST' },
                    { name: 'User Profile', icon: Users, desc: 'Account management', methods: 'GET, PUT' },
                    { name: 'Wishlist', icon: Building2, desc: 'Saved properties', methods: 'GET, POST, DELETE' },
                    { name: 'Payments', icon: CreditCard, desc: 'Deposit payments', methods: 'POST' },
                    { name: 'Add Property', icon: Upload, desc: 'Submit listing', methods: 'POST' },
                  ].map((module) => (
                    <div key={module.name} className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <module.icon className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm">{module.name}</span>
                      </div>
                      <div className="text-xs text-slate-600 mb-1">{module.desc}</div>
                      <div className="text-xs text-blue-700 font-medium">{module.methods}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MOBILE APP APIs */}
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-green-300">
                  <Smartphone className="w-6 h-6 text-green-600" />
                  <h4 className="font-bold text-slate-800 text-lg">Mobile App APIs</h4>
                  <span className="ml-auto text-xs text-slate-600 bg-green-100 px-3 py-1 rounded-full">iOS + Android</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { name: 'Auth', icon: Lock, desc: 'Login/Register', methods: 'POST' },
                    { name: 'Push Notifications', icon: Bell, desc: 'Bid alerts', methods: 'GET, POST' },
                    { name: 'Live Auctions', icon: Gavel, desc: 'Real-time bidding', methods: 'GET, POST, WS' },
                    { name: 'Property Search', icon: Building2, desc: 'Filter & search', methods: 'GET' },
                    { name: 'Image Upload', icon: Upload, desc: 'Upload photos', methods: 'POST' },
                    { name: 'Geolocation', icon: Map, desc: 'Nearby properties', methods: 'GET' },
                    { name: 'QR Scanner', icon: CheckSquare, desc: 'Scan property QR', methods: 'POST' },
                    { name: 'Video Calls', icon: Video, desc: 'Virtual tours', methods: 'POST' },
                    { name: 'Offline Sync', icon: Database, desc: 'Cached data', methods: 'GET' },
                    { name: 'Biometric Auth', icon: Shield, desc: 'Fingerprint/Face ID', methods: 'POST' },
                  ].map((module) => (
                    <div key={module.name} className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <module.icon className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-sm">{module.name}</span>
                      </div>
                      <div className="text-xs text-slate-600 mb-1">{module.desc}</div>
                      <div className="text-xs text-green-700 font-medium">{module.methods}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Labels */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">JWT Verification via Supabase</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Request/Response Logging</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Error Handling & Retry Logic</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Audit Logging</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Role-Based Access Control</span>
            </div>
          </div>

          {/* Data Flow Arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
              <span className="text-sm text-slate-500 mt-2">Database Queries & External API Calls</span>
            </div>
          </div>

          {/* Database & External Services Layer */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-300 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Database & External Services</h2>
                <p className="text-sm text-slate-500">MongoDB Atlas + Supabase</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* MongoDB Atlas */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-300">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-slate-800">MongoDB Atlas</h3>
                </div>
                <p className="text-xs text-slate-600 mb-4">Primary Business Database</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">
                    <div className="font-semibold text-green-700">Collections:</div>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">properties</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">auctions</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">bids</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">users</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">agents</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">payments</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">valuations</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">kycDocuments</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">mortgages</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">campaigns</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">notifications</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">pages</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">menus</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">settings</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-green-200">auditLogs</div>
                </div>
              </div>

              {/* Supabase Auth */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl p-6 border-2 border-emerald-300">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">Supabase Auth</h3>
                </div>
                <p className="text-xs text-slate-600 mb-4">Authentication Service</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-emerald-200">
                    <div className="font-semibold text-emerald-700">Features:</div>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-emerald-200">User Registration</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-emerald-200">Login / Logout</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-emerald-200">JWT Token Generation</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-emerald-200">Session Management</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-emerald-200">Password Reset</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-emerald-200">Email Verification</div>
                </div>
              </div>

              {/* Supabase Storage */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-6 border-2 border-blue-300">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-slate-800">Supabase Storage</h3>
                </div>
                <p className="text-xs text-slate-600 mb-4">File Upload Service</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                    <div className="font-semibold text-blue-700">Buckets:</div>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">property-images</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">property-videos</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">legal-documents</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">kyc-documents</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">user-avatars</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">contracts-pdf</div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                    <div className="text-xs text-slate-600 mt-1">Direct upload from frontend</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Services */}
            <div className="mt-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-300">
              <h3 className="font-semibold text-slate-800 mb-3">Optional Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-white rounded-lg px-4 py-3 border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-1">Email Service</div>
                  <div className="text-xs text-slate-500">SendGrid / AWS SES</div>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-1">Realtime Updates</div>
                  <div className="text-xs text-slate-500">Supabase Realtime</div>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-1">Cache Layer</div>
                  <div className="text-xs text-slate-500">Redis / Upstash</div>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-1">Queue System</div>
                  <div className="text-xs text-slate-500">BullMQ / RabbitMQ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Flow Summary */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Data Flow Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">1</div>
                  User Action
                </div>
                <div className="text-white/90 text-xs">User submits form or clicks button in Next.js UI</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">2</div>
                  API Request
                </div>
                <div className="text-white/90 text-xs">Frontend sends authenticated HTTP request with JWT token</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">3</div>
                  Backend Processing
                </div>
                <div className="text-white/90 text-xs">Node.js validates, processes through layers, queries MongoDB</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">4</div>
                  External Services
                </div>
                <div className="text-white/90 text-xs">Verifies token with Supabase Auth, uploads files to Storage</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">5</div>
                  Response
                </div>
                <div className="text-white/90 text-xs">Backend returns JSON response, frontend updates UI state</div>
              </div>
            </div>
          </div>

          {/* Tech Stack Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Next.js', category: 'Frontend Framework', color: 'bg-black' },
                { name: 'TypeScript', category: 'Language', color: 'bg-blue-600' },
                { name: 'Node.js', category: 'Backend Runtime', color: 'bg-green-600' },
                { name: 'Express', category: 'API Framework', color: 'bg-slate-700' },
                { name: 'MongoDB', category: 'Database', color: 'bg-green-500' },
                { name: 'Supabase', category: 'Auth & Storage', color: 'bg-emerald-500' },
              ].map((tech) => (
                <div key={tech.name} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 text-center">
                  <div className={`w-12 h-12 ${tech.color} rounded-lg mx-auto mb-3`}></div>
                  <div className="font-bold text-slate-800">{tech.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{tech.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>Enterprise-grade architecture designed for scalability, security, and maintainability</p>
          <p className="mt-2">© 2026 System Architecture Documentation</p>
        </div>
      </div>
    </div>
  );
}