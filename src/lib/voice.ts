export class VoiceRecognition {
  private recognition: any;
  private isListening: boolean = false;
  private onResultCallback?: (transcript: string) => void;
  private onStartCallback?: () => void;
  private onEndCallback?: () => void;
  private onErrorCallback?: (error: string) => void;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStartCallback?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEndCallback?.();
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      this.onErrorCallback?.(event.error);
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.onResultCallback?.(transcript);
    };
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public start(): void {
    if (!this.isSupported()) {
      throw new Error('Voice recognition is not supported in this browser');
    }

    if (!this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        throw error;
      }
    }
  }

  public stop(): void {
    if (this.isListening) {
      this.recognition.stop();
    }
  }

  public onResult(callback: (transcript: string) => void): void {
    this.onResultCallback = callback;
  }

  public onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  public onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  public onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  public isActive(): boolean {
    return this.isListening;
  }
}

export const voiceRecognition = new VoiceRecognition();