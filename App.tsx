
import React, { useState, useCallback } from 'react';
import { FileUp, BookOpen, BrainCircuit, ClipboardCheck, LoaderCircle } from './components/Icons';
import FileUpload from './components/FileUpload';
import OutputDisplay from './components/OutputDisplay';
import { extractText } from './services/pdfParserService';
import { generateSummary, generateStudyPlan, generateQuiz } from './services/geminiService';
import { QuizQuestion, ActiveView } from './types';

export default function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [generatedContent, setGeneratedContent] = useState<{
    summary: string | null;
    plan: string | null;
    quiz: QuizQuestion[] | null;
  }>({ summary: null, plan: null, quiz: null });

  const handleFileChange = useCallback(async (file: File) => {
    if (file.size > 25 * 1024 * 1024) { // 25 MB limit
      setError('File size exceeds 25 MB. Please upload a smaller PDF.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Parsing your PDF...');
    setError(null);
    setPdfFile(file);
    setActiveView(null);
    setGeneratedContent({ summary: null, plan: null, quiz: null });

    try {
      const text = await extractText(file);
      setPdfText(text);
    } catch (err) {
      setError('Failed to parse the PDF. Please ensure it is a valid file.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);
  
  const handleReset = () => {
    setPdfFile(null);
    setPdfText(null);
    setError(null);
    setActiveView(null);
    setGeneratedContent({ summary: null, plan: null, quiz: null });
  };

  const handleGenerate = useCallback(async (type: 'summary' | 'plan' | 'quiz') => {
    if (!pdfText) {
      setError('PDF text is not available. Please upload a file first.');
      return;
    }
    
    if (generatedContent[type]) {
      setActiveView(type);
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveView(type);

    try {
      if (type === 'summary') {
        setLoadingMessage('Generating a concise summary...');
        const summary = await generateSummary(pdfText);
        setGeneratedContent(prev => ({ ...prev, summary }));
      } else if (type === 'plan') {
        setLoadingMessage('Crafting your 4-week study plan...');
        const plan = await generateStudyPlan(pdfText);
        setGeneratedContent(prev => ({ ...prev, plan }));
      } else if (type === 'quiz') {
        setLoadingMessage('Creating a quiz to test your knowledge...');
        const quiz = await generateQuiz(pdfText);
        setGeneratedContent(prev => ({ ...prev, quiz }));
      }
    } catch (err) {
      setError(`Failed to generate ${type}. Please try again.`);
      console.error(err);
      setActiveView(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [pdfText, generatedContent]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
          PDF Learning Assistant
        </h1>
        <p className="text-lg text-gray-400">
          Transform any PDF into a summary, study plan, or quiz with AI.
        </p>
      </header>

      <main className="w-full max-w-5xl flex-grow">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!pdfFile ? (
          <FileUpload onFileSelect={handleFileChange} />
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
            <OutputDisplay
              pdfName={pdfFile.name}
              onGenerate={handleGenerate}
              onReset={handleReset}
              activeView={activeView}
              content={generatedContent}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-5xl text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Gemini & React</p>
      </footer>
    </div>
  );
}
