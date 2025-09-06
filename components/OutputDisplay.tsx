
import React from 'react';
import { BookOpen, BrainCircuit, ClipboardCheck, FileText, RotateCw, LoaderCircle } from './Icons';
import { QuizQuestion, ActiveView } from '../types';
import QuizView from './QuizView';
import MarkdownRenderer from './MarkdownRenderer';

interface OutputDisplayProps {
  pdfName: string;
  onGenerate: (type: 'summary' | 'plan' | 'quiz') => void;
  onReset: () => void;
  activeView: ActiveView;
  content: {
    summary: string | null;
    plan: string | null;
    quiz: QuizQuestion[] | null;
  };
  isLoading: boolean;
  loadingMessage: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  pdfName,
  onGenerate,
  onReset,
  activeView,
  content,
  isLoading,
  loadingMessage,
}) => {

  const renderContent = () => {
    if (isLoading && !content[activeView!]) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <LoaderCircle className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
          <p className="text-lg font-semibold">{loadingMessage}</p>
          <p className="text-gray-400">AI is working its magic, please wait...</p>
        </div>
      );
    }

    switch (activeView) {
      case 'summary':
        return <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{content.summary}</div>;
      case 'plan':
        return <MarkdownRenderer content={content.plan || ''} />;
      case 'quiz':
        return content.quiz ? <QuizView questions={content.quiz} /> : null;
      default:
        return (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">Select an option above to get started.</p>
            </div>
        );
    }
  };

  const ActionButton = ({ type, icon, label }: { type: 'summary' | 'plan' | 'quiz', icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => onGenerate(type)}
      disabled={isLoading}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        activeView === type
          ? 'bg-cyan-600 text-white shadow-lg'
          : 'bg-gray-700 hover:bg-gray-600'
      }`}
    >
      {isLoading && activeView === type ? (
        <LoaderCircle className="w-5 h-5 animate-spin" />
      ) : (
        icon
      )}
      <span>{label}</span>
    </button>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <FileText className="w-8 h-8 text-cyan-400" />
          <span className="font-semibold text-lg truncate" title={pdfName}>{pdfName}</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          <span>Upload New PDF</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
        <ActionButton type="summary" icon={<BookOpen className="w-5 h-5" />} label="Summary" />
        <ActionButton type="plan" icon={<BrainCircuit className="w-5 h-5" />} label="Study Plan" />
        <ActionButton type="quiz" icon={<ClipboardCheck className="w-5 h-5" />} label="Quiz" />
      </div>

      <div className="bg-gray-900/50 p-6 rounded-lg min-h-[200px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputDisplay;
