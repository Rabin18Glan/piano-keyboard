use wasm_bindgen::prelude::*;
use web_sys::{AudioContext, OscillatorNode, GainNode, OscillatorType};

#[wasm_bindgen]
pub struct PianoEngine {
    ctx: AudioContext,
}

#[wasm_bindgen]
impl PianoEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<PianoEngine, JsValue> {
        console_error_panic_hook::set_once();
        let ctx = AudioContext::new()?;
        Ok(PianoEngine { ctx })
    }

    pub fn set_volume(&self, _val: f32) {
        // Global volume could be handled here if we had a master gain node
        // For now, per-note volume is fixed/internal
    }

    /// Plays a tone at the given frequency using a simple synth patch (Sales/Triangle mix approx)
    pub fn play(&self, freq: f32) -> Result<Note, JsValue> {
        let now = self.ctx.current_time();

        // Oscillator 1 (Triangle - Body)
        let osc = self.ctx.create_oscillator()?;
        osc.set_type(OscillatorType::Triangle);
        osc.frequency().set_value(freq);

        // Envelope setup
        let gain = self.ctx.create_gain()?;
        
        // Connect graph
        osc.connect_with_audio_node(&gain)?;
        gain.connect_with_audio_node(&self.ctx.destination())?;

        // ADSR Envelope
        // Attack: 0 -> 0.6 in 0.02s
        gain.gain().cancel_scheduled_values(now);
        gain.gain().set_value_at_time(0.0, now)?;
        gain.gain().linear_ramp_to_value_at_time(0.6, now + 0.02)?;
        // Decay: 0.6 -> 0.4 in 0.2s
        gain.gain().linear_ramp_to_value_at_time(0.4, now + 0.2)?;

        osc.start()?;

        Ok(Note { osc, gain })
    }
    
    pub fn resume(&self) -> Result<(), JsValue> {
        if self.ctx.state() == web_sys::AudioContextState::Suspended {
             let _ = self.ctx.resume()?;
        }
        Ok(())
    }

    pub fn close(&self) -> Result<(), JsValue> {
        let _ = self.ctx.close()?;
        Ok(())
    }
}

#[wasm_bindgen]
pub struct Note {
    osc: OscillatorNode,
    gain: GainNode,
}

#[wasm_bindgen]
impl Note {
    pub fn stop(&self) -> Result<(), JsValue> {
        let ctx = self.gain.context();
        let now = ctx.current_time();
        
        // Release: Current -> 0 in 0.2s
        let current_gain = self.gain.gain().value();
        let _ = self.gain.gain().cancel_scheduled_values(now);
        self.gain.gain().set_value_at_time(current_gain, now)?;
        self.gain.gain().exponential_ramp_to_value_at_time(0.001, now + 0.2)?;
        
        self.osc.stop_with_when(now + 0.2)?;
        Ok(())
    }

    pub fn disconnect(&self) -> Result<(), JsValue> {
        self.gain.disconnect()?;
        let _ = self.osc.disconnect();
        Ok(())
    }
}
