'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
          <div className="p-4 rounded-full bg-destructive/10 mb-6">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Oups ! Quelque chose s'est mal passé.</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            L'application a rencontré une erreur inattendue. Nos ingénieurs ont été notifiés.
          </p>
          
          <div className="flex gap-4">
            <Button onClick={this.handleReload} variant="default" className="gap-2 software-btn">
              <RefreshCcw className="w-4 h-4" />
              Recharger l'application
            </Button>
            <Button onClick={this.handleGoHome} variant="outline" className="gap-2 software-btn">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-4 bg-muted rounded-xl text-left max-w-2xl overflow-auto border">
              <p className="text-xs font-mono text-destructive font-bold mb-2">DEBUG INFO:</p>
              <code className="text-xs font-mono">{this.state.error?.toString()}</code>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
