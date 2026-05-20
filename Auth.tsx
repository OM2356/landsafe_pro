import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Mail, User, CheckCircle, FileText, Search, Activity, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function Auth({ onLogin }: { onLogin: (user: any, token: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleAuth = async (type: 'login' | 'register') => {
    setLoading(true);
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      if (type === 'login') {
        onLogin(data.user, data.token);
        toast.success('Welcome back!');
      } else {
        toast.success('Registration successful! Please login.');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: "AI Analysis",
      description: "Our advanced Gemini-powered AI scans every clause to identify risks.",
      icon: <Search className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: "Fraud Detection",
      description: "Detect missing signatures, forged stamps, and inconsistent dates instantly.",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: "Legal Summary",
      description: "Get a plain-English summary of complex legal property documents.",
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: "Real-time Stats",
      description: "Monitor verification trends and safety metrics across your portfolio.",
      icon: <Activity className="w-6 h-6 text-indigo-600" />,
    }
  ];

  const steps = [
    { number: "01", title: "Upload", text: "Upload your PDF or image document securely." },
    { number: "02", title: "Analyze", text: "AI extracts text and cross-references legal patterns." },
    { number: "03", title: "Result", text: "Receive a detailed safety report and risk score." }
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                Next-Gen Property Verification
              </div>
              <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Verify Your Land <br />
                <span className="text-indigo-600 italic">Before You Buy.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                LandSafe Pro uses advanced AI to protect your investment. Detect fraud, analyze legal clauses, and ensure peace of mind in seconds.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                AI Fraud Detection
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Legal Clause Audit
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Instant Score
              </div>
            </div>
            
            <div className="pt-4">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 group h-12 px-8 text-lg" onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          <motion.div 
            id="auth-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mr-0"
          >
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-slate-200 shadow-2xl shadow-indigo-500/10 transition-all hover:shadow-indigo-500/15">
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your secure vault.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input 
                          id="password" 
                          type="password" 
                          className="pl-10"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-10" onClick={() => handleAuth('login')} disabled={loading}>
                      {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card className="border-slate-200 shadow-2xl shadow-indigo-500/10">
                  <CardHeader>
                    <CardTitle>Create Free Account</CardTitle>
                    <CardDescription>Join 10,000+ users protecting their investments.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          className="pl-10"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input 
                          id="reg-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input 
                          id="reg-password" 
                          type="password" 
                          className="pl-10"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-10" onClick={() => handleAuth('register')} disabled={loading}>
                      {loading ? 'Creating account...' : 'Start Free Trial'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by property professionals everywhere</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
             {/* Simulating logos with text for design flair */}
             <span className="text-2xl font-bold text-slate-600">RealEstately</span>
             <span className="text-2xl font-bold text-slate-600">LandTrust</span>
             <span className="text-2xl font-bold text-slate-600">TerraVerify</span>
             <span className="text-2xl font-bold text-slate-600">PropCheck</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900">Everything you need to secure your deal.</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Our platform combines legal expertise with cutting-edge artificial intelligence to give you an unfair advantage.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-indigo-100"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           {/* Grid Pattern abstraction */}
           <div className="w-full h-full border-indigo-500 border-[1px] opacity-10" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold leading-tight">Complex verification, <br />made simple.</h2>
              <div className="space-y-12">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                      {step.number}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-indigo-600/20 rounded-full absolute -top-12 -right-12 blur-3xl" />
              <Card className="bg-slate-800 border-slate-700 shadow-2xl relative z-10 overflow-hidden">
                 <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                 <CardHeader className="text-white">
                   <div className="flex items-center justify-between mb-2">
                     <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30">Verified</Badge>
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Analysis Log #4729</p>
                   </div>
                   <CardTitle className="text-white text-lg">Sale Deed Verification</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-slate-700 rounded animate-pulse" />
                      <div className="h-2 w-1/2 bg-slate-700 rounded animate-pulse delay-75" />
                      <div className="h-2 w-2/3 bg-slate-700 rounded animate-pulse delay-150" />
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                       <p className="text-xs text-green-400 font-medium">✨ AI Confidence Score: 98%</p>
                    </div>
                 </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview / Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-slate-900">Still have questions?</h2>
          <p className="text-slate-500 leading-relaxed">Our legal team is available 24/7 to assist with your document verification needs.</p>
        </div>
        <div className="bg-indigo-600 rounded-3xl p-12 text-white text-center space-y-6 shadow-2xl shadow-indigo-500/20">
          <h3 className="text-3xl font-bold">Ready to secure your future?</h3>
          <p className="text-indigo-100 max-w-xl mx-auto">Join the most trusted property verification platform in India. Get your first scan free.</p>
          <div className="pt-4">
            <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-slate-50 h-14 px-10 text-lg font-bold" onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Scanning Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1 rounded-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            LandSafe<span className="text-indigo-600">Pro</span>
          </span>
        </div>
        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a>
        </div>
        <p className="text-xs text-slate-400">© 2026 LandSafe Pro Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
