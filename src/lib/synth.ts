export class Synth {
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private reverbNode: ConvolverNode;

  constructor(audioContext?: AudioContext) {
    this.audioContext =
      audioContext ||
      new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.createGainNode();
    this.gainNode.connect(this.audioContext.destination);
    this.reverbNode = this.createReverb();
    this.gainNode.connect(this.reverbNode);
    this.reverbNode.connect(this.audioContext.destination);
  }

  private getFrequency(noteNumber: number): number {
    return 440 * Math.pow(2, (noteNumber - 69) / 12);
  }
  private createOscillator(noteNumber: number): OscillatorNode {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(
      this.getFrequency(noteNumber),
      this.audioContext.currentTime
    );
    return oscillator;
  }
  private createGainNode(): GainNode {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    return gainNode;
  }
  private createReverb(): ConvolverNode {
    const reverbTime = 5.0; // seconds
    const decay = 2.0; // decay factor
    // Create a ConvolverNode
    const convolver = this.audioContext.createConvolver();

    // Generate impulse response for the reverb
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * reverbTime;
    const impulseResponse = this.audioContext.createBuffer(
      2,
      length,
      sampleRate
    );

    // Fill both channels with noise, attenuated over time
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulseResponse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Initial random noise
        const noise = Math.random() * 2 - 1;
        // Exponential decay
        channelData[i] = noise * Math.pow(1 - i / length, decay);
      }
    }

    // Set the impulse response for the convolver node
    convolver.buffer = impulseResponse;

    return convolver;
  }
  public play(noteNumber: number): void {
    console.count("play");

    const oscillator = this.createOscillator(noteNumber);
    const envelope = this.audioContext.createGain();

    // Start with zero gain
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime);

    // Smooth attack - gradually increase gain over 15ms
    envelope.gain.linearRampToValueAtTime(
      0.5,
      this.audioContext.currentTime + 0.005
    );

    // Sustain for a moment at peak volume
    // envelope.gain.setTargetAtTime(
    //   0.4,
    //   this.audioContext.currentTime + 0.015,
    //   0.1
    // );

    // Smooth release - gradually decrease gain
    envelope.gain.setTargetAtTime(0, this.audioContext.currentTime + 0.2, 0.2);

    envelope.connect(this.gainNode);
    oscillator.connect(envelope);

    oscillator.start(this.audioContext.currentTime);

    // Stop the oscillator after the release phase would have fully decayed
    // 0.5 (attack+sustain) + 1.0 (enough time for release to reach near-zero)
    oscillator.stop(this.audioContext.currentTime + 1.5);

    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }

  getOutputNode(): AudioNode {
    return this.gainNode as AudioNode;
  }
}
