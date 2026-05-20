import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
// import { analyzeDocument } from '../lib/gemini'; // Moved to server-side for security

export default function DocumentUpload({ user }: { user: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        // Call secure backend for analysis
        const analyzeResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            text: text || "Sample document content for analysis",
            fileName: file.name
          }),
        });

        if (!analyzeResponse.ok) throw new Error('AI Analysis failed');
        const analysis = await analyzeResponse.json();
        
        // Save to backend documents list
        const saveResponse = await fetch('/api/documents', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: file.name,
            type: analysis.documentType,
            analysis: analysis,
            status: analysis.status
          }),
        });

        if (!saveResponse.ok) throw new Error('Failed to save document record');
        
        setResult(analysis);
        toast.success('Document analyzed and verified!');
      };
      reader.readAsText(file);
    } catch (error: any) {
      toast.error(error.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Verify Property Document</h1>
        <p className="text-slate-500">Upload your document for AI-powered authenticity analysis and risk assessment.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-dashed border-2 border-slate-200 hover:border-indigo-400 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              Upload Document
            </CardTitle>
            <CardDescription>Supported formats: PDF, Images, Text (Max 10MB)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 border-t border-slate-50">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.txt"
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center gap-4 group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                <FileText className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-900">
                  {file ? file.name : 'Click to select or drag and drop'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'No file selected'}
                </p>
              </div>
            </label>
          </CardContent>
          <CardFooter className="bg-slate-50/50">
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              disabled={!file || analyzing}
              onClick={handleUpload}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                'Start Analysis'
              )}
            </Button>
          </CardFooter>
        </Card>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="result"
            >
              <Card className={`h-full border-l-4 ${result.status === 'Safe' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className={`w-5 h-5 ${result.status === 'Safe' ? 'text-green-600' : 'text-red-600'}`} />
                      Analysis Result
                    </CardTitle>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      result.status === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {result.status}
                    </div>
                  </div>
                  <CardDescription>AI-generated verification summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Document Type</h4>
                    <p className="text-sm font-medium text-slate-900">{result.documentType}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Property Details</h4>
                    <p className="text-sm text-slate-700">{result.propertyDetails}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Identified Risks</h4>
                    <ul className="mt-1 space-y-1">
                      {result.risks.map((risk: string, i: number) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                      {result.risks.length === 0 && (
                        <li className="text-sm text-green-600 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          No major risks identified
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm italic text-slate-600 leading-relaxed">
                      "{result.summary}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl p-8 text-center bg-slate-50/30">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <ShieldCheck className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-sm font-medium text-slate-600">No Analysis Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Upload a document on the left to see AI verification results here.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
