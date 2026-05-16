import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles/theme';
import { TextStyles } from '../styles/Text';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary global pour catcher les crashes JS et éviter les reloads complets
 * Utilise le pattern class component car les Error Boundaries doivent être des class components
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Mettre à jour l'état pour afficher l'UI de fallback
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Logger l'erreur pour le debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Ici tu pourrais envoyer l'erreur à un service de tracking (ex: Sentry, Crashlytics)
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Si un fallback personnalisé est fourni, l'utiliser
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Sinon, afficher l'UI de fallback par défaut
      return (
        <View style={styles.container}>
          <Text style={[TextStyles.TextPost, styles.title]}>Oops! Une erreur est survenue</Text>
          <Text style={[TextStyles.TextBlack, styles.message]}>
            L'application a rencontré une erreur inattendue. Veuillez réessayer.
          </Text>
          {__DEV__ && this.state.error && (
            <View style={styles.errorDetails}>
              <Text style={[TextStyles.TextBlack, styles.errorText]}>
                {this.state.error.toString()}
              </Text>
              {this.state.errorInfo && (
                <Text style={[TextStyles.TextBlack, styles.stackTrace]}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </View>
          )}
          <Text 
            style={[TextStyles.TextPost, styles.resetButton]} 
            onPress={this.handleReset}
          >
            Réessayer
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.Background_Primary,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.ItemSecondary,
  },
  errorDetails: {
    width: '100%',
    maxHeight: 300,
    backgroundColor: Colors.Background_Elements,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 10,
    color: Colors.ItemSecondary,
    fontFamily: 'monospace',
  },
  resetButton: {
    fontSize: 18,
    color: Colors.Button,
    textDecorationLine: 'underline',
  },
});






