/**
 * MixBus - A class for managing a group of audio signals with common processing
 * 
 * This class provides functionality for routing multiple audio sources through
 * a common processing chain with volume control, effects, and output routing.
 */
class MixBus {
    private context: AudioContext;
    private input: GainNode;
    private output: GainNode;
    private limiter: DynamicsCompressorNode;
    private effectsChain: AudioNode[] = [];
    private sources: Set<AudioNode> = new Set();
    private _muted: boolean = false;
    private _volume: number = 1.0;
    private _name: string;
    
    /**
     * Creates a new MixBus
     * @param context The AudioContext to use
     * @param name Optional name for this mix bus
     */
    constructor(context: AudioContext, name: string = "Mix Bus") {
      this.context = context;
      this._name = name;
      
      // Create input and output gain nodes
      this.input = context.createGain();
      this.output = context.createGain();
      
      // Create a limiter (implemented as a compressor with specific settings)
      this.limiter = context.createDynamicsCompressor();
      this.configureDefaultLimiter();
      
      // Connect input to limiter, and limiter to output
      this.input.connect(this.limiter);
      this.limiter.connect(this.output);
    }
    
    /**
     * Get the name of this mix bus
     */
    get name(): string {
      return this._name;
    }
    
    /**
     * Set the name of this mix bus
     */
    set name(value: string) {
      this._name = value;
    }
    
    /**
     * Get the current volume (0.0 to 1.0)
     */
    get volume(): number {
      return this._volume;
    }
    
    /**
     * Set the volume (0.0 to 1.0)
     */
    set volume(value: number) {
      this._volume = Math.max(0, Math.min(1, value));
      if (!this._muted) {
        this.output.gain.setValueAtTime(this._volume, this.context.currentTime);
      }
    }
    
    /**
     * Get the mute state
     */
    get muted(): boolean {
      return this._muted;
    }
    
    /**
     * Set the mute state
     */
    set muted(value: boolean) {
      this._muted = value;
      this.output.gain.setValueAtTime(value ? 0 : this._volume, this.context.currentTime);
    }
    
    /**
     * Adds an audio source to this mix bus
     * @param source The audio node to add as a source
     * @returns This mix bus instance for chaining
     */
    addSource(source: AudioNode): MixBus {
      source.connect(this.input);
      this.sources.add(source);
      return this;
    }
    
    /**
     * Removes an audio source from this mix bus
     * @param source The audio node to remove
     * @returns This mix bus instance for chaining
     */
    removeSource(source: AudioNode): MixBus {
      if (this.sources.has(source)) {
        source.disconnect(this.input);
        this.sources.delete(source);
      }
      return this;
    }
    
    /**
     * Connect the mix bus output to a destination
     * @param destination The audio node to connect to
     * @returns This mix bus instance for chaining
     */
    connect(destination: AudioNode): MixBus {
      this.output.connect(destination);
      return this;
    }
    
    /**
     * Disconnect the mix bus from all destinations
     * @returns This mix bus instance for chaining
     */
    disconnect(): MixBus {
      this.output.disconnect();
      return this;
    }
    
    /**
     * Add an effect to the mix bus processing chain
     * @param effect The effect node to add
     * @returns This mix bus instance for chaining
     */
    addEffect(effect: AudioNode): MixBus {
      // Disconnect the current chain
      this.input.disconnect();
      
      // If this is the first effect, connect input to it
      if (this.effectsChain.length === 0) {
        this.input.connect(effect);
      } else {
        // Otherwise connect the last effect to this new one
        this.effectsChain[this.effectsChain.length - 1].disconnect();
        this.effectsChain[this.effectsChain.length - 1].connect(effect);
      }
      
      // Connect the new effect to the limiter (not directly to output)
      effect.connect(this.limiter);
      
      // Add the effect to our chain
      this.effectsChain.push(effect);
      
      return this;
    }
    
    /**
     * Remove an effect from the mix bus processing chain
     * @param effect The effect to remove
     * @returns This mix bus instance for chaining
     */
    removeEffect(effect: AudioNode): MixBus {
      const index = this.effectsChain.indexOf(effect);
      if (index === -1) return this;
      
      // Disconnect the entire chain
      this.input.disconnect();
      this.effectsChain.forEach(fx => fx.disconnect());
      
      // Remove the effect
      this.effectsChain.splice(index, 1);
      
      // Reconnect the chain
      if (this.effectsChain.length === 0) {
        // If no effects remain, connect input directly to limiter
        this.input.connect(this.limiter);
      } else {
        // Otherwise reconnect the chain
        this.input.connect(this.effectsChain[0]);
        
        for (let i = 0; i < this.effectsChain.length - 1; i++) {
          this.effectsChain[i].connect(this.effectsChain[i + 1]);
        }
        
        // Connect the last effect to the limiter
        this.effectsChain[this.effectsChain.length - 1].connect(this.limiter);
      }
      
      return this;
    }
    
    /**
     * Clear all effects from the mix bus
     * @returns This mix bus instance for chaining
     */
    clearEffects(): MixBus {
      // Disconnect everything
      this.input.disconnect();
      this.effectsChain.forEach(effect => effect.disconnect());
      
      // Clear the effects array
      this.effectsChain = [];
      
      // Reconnect input directly to limiter
      this.input.connect(this.limiter);
      
      return this;
    }
    
    /**
     * Get the input node for this mix bus
     * Useful for more complex routing scenarios
     */
    getInputNode(): GainNode {
      return this.input;
    }
    
    /**
     * Get the output node for this mix bus
     * Useful for more complex routing scenarios
     */
    getOutputNode(): GainNode {
      return this.output;
    }
    
    /**
     * Get the limiter node
     * Useful for adjusting limiter settings
     */
    getLimiterNode(): DynamicsCompressorNode {
      return this.limiter;
    }
    
    /**
     * Configure the default limiter settings
     * These settings make the compressor act more like a limiter
     * @private
     */
    private configureDefaultLimiter(): void {
      // Set attack to very fast to catch transients
      this.limiter.attack.value = 0.003;
      
      // Set release to moderate to recover quickly but avoid pumping
      this.limiter.release.value = 0.25;
      
      // Set ratio very high for true limiting behavior
      this.limiter.ratio.value = 20;
      
      // Set knee to 0 for hard-knee compression (more limiting-like)
      this.limiter.knee.value = 0;
      
      // Set threshold to -3dB to prevent digital clipping while preserving headroom
      this.limiter.threshold.value = -3;
    }
    
    /**
     * Enable or disable the limiter
     * @param enabled Whether the limiter should be enabled
     */
    setLimiterEnabled(enabled: boolean): MixBus {
      if (enabled) {
        // Reconnect the limiter if it was bypassed
        if (this.input.numberOfOutputs > 0) {
          this.input.disconnect();
          if (this.effectsChain.length === 0) {
            this.input.connect(this.limiter);
          } else {
            this.input.connect(this.effectsChain[0]);
            this.effectsChain[this.effectsChain.length - 1].disconnect();
            this.effectsChain[this.effectsChain.length - 1].connect(this.limiter);
          }
          this.limiter.connect(this.output);
        }
      } else {
        // Bypass the limiter
        this.limiter.disconnect();
        if (this.effectsChain.length === 0) {
          this.input.disconnect();
          this.input.connect(this.output);
        } else {
          this.effectsChain[this.effectsChain.length - 1].disconnect();
          this.effectsChain[this.effectsChain.length - 1].connect(this.output);
        }
      }
      return this;
    }
    
    /**
     * Configure the limiter parameters
     * @param options Configuration options for the limiter
     */
    configureLimiter(options: {
      threshold?: number;
      knee?: number;
      ratio?: number;
      attack?: number;
      release?: number;
    }): MixBus {
      if (options.threshold !== undefined) {
        this.limiter.threshold.value = options.threshold;
      }
      if (options.knee !== undefined) {
        this.limiter.knee.value = options.knee;
      }
      if (options.ratio !== undefined) {
        this.limiter.ratio.value = options.ratio;
      }
      if (options.attack !== undefined) {
        this.limiter.attack.value = options.attack;
      }
      if (options.release !== undefined) {
        this.limiter.release.value = options.release;
      }
      return this;
    }
  }
  
  export default MixBus;