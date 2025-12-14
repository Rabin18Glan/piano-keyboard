import React, { useEffect, useRef, useState, useCallback } from 'react';
import init, { PianoEngine, Note } from '../../audio-engine/pkg/audio_engine';
import { NOTES } from '../utils/frequencies';
import { Key } from './Key';

export const Piano: React.FC = () => {
    const [isReady, setIsReady] = useState(false);
    const engineRef = useRef<PianoEngine | null>(null);
    const notesRef = useRef<Map<string, Note>>(new Map());
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isUnmounted = false;

        init().then(() => {
            if (isUnmounted) return;

            try {
                // Initialize engine (creates its own AudioContext internally now)
                const engine = new PianoEngine();
                
                if (engineRef.current) {
                     // Safety check if we somehow raced
                     try { engineRef.current.free(); } catch(e){}
                }
                
                engineRef.current = engine;
                setIsReady(true);
            } catch (e) {
                console.error("Failed to init audio engine", e);
            }
        });
        
        return () => {
             isUnmounted = true;
             if (engineRef.current) {
                 try {
                     engineRef.current.close(); // Close AudioContext
                 } catch(e) { console.error("Close error", e); }
                 
                 try {
                     engineRef.current.free(); // Free WASM memory
                 } catch (e) { console.error("Free error", e) }
                 
                 engineRef.current = null; // Important: Null it out
             }
             setIsReady(false);
        };
    }, []);

    // Scroll to middle on load
    useEffect(() => {
        if (isReady && scrollContainerRef.current) {
            const middleIndex = Math.floor(NOTES.length / 2);
            // Rough estimate of key width (white keys are approx 64px + gaps)
            // But getting the actual scroll width is better.
            const container = scrollContainerRef.current;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
             // distinct white keys
             const whiteKeys = NOTES.filter(n => n.type === 'white');
             const middleWhiteKeyIndex = Math.floor(whiteKeys.length / 2);
             // 3.5rem (w-14) is 56px.
             const scrollPos = (middleWhiteKeyIndex * 56) - (clientWidth / 2) + 28;
            
            container.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
    }, [isReady]);

    const playNote = useCallback((noteDef: typeof NOTES[0]) => {
        if (!engineRef.current) return;
        
        // Safety: Attempt strict resume, handle failure gently
        try {
             engineRef.current.resume();
        } catch(e) { console.warn("Context resume failed", e); }

        if (notesRef.current.has(noteDef.note)) return;

        try {
            const noteObj = engineRef.current.play(noteDef.freq);
            notesRef.current.set(noteDef.note, noteObj);
            setActiveKeys(prev => {
                const next = new Set(prev);
                next.add(noteDef.note);
                return next;
            });
        } catch (e) {
            console.error("Play error", e);
        }
    }, []);

    const stopNote = useCallback((noteDef: typeof NOTES[0]) => {
        const noteObj = notesRef.current.get(noteDef.note);
        if (noteObj) {
            try {
                // Initiate release ramp (0.2s)
                noteObj.stop();
                
                // Remove from map immediately so new notes can be played
                notesRef.current.delete(noteDef.note);
                
                // Schedule Graph Disconnection & Memory Free
                setTimeout(() => {
                    try {
                        if (noteObj) {
                            noteObj.disconnect();
                            noteObj.free();
                        }
                    } catch(err) {
                        console.warn("Cleanup warning:", err);
                    }
                }, 250); // > 200ms release time

            } catch (e) {
                console.error("Stop error", e);
            }
            
            setActiveKeys(prev => {
                const next = new Set(prev);
                next.delete(noteDef.note);
                return next;
            });
        }
    }, []);

    // Keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
            // Prevent default for mapped keys to stop scrolling/browser actions
            const note = NOTES.find(n => n.key.toLowerCase() === e.key.toLowerCase());
            if (note) {
                 // e.preventDefault(); // Optional: might block important shortcuts, use with care
                 playNote(note);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const note = NOTES.find(n => n.key.toLowerCase() === e.key.toLowerCase());
            if (note) stopNote(note);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [playNote, stopNote]);

    if (!isReady) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-[#121214]">
                <div className="text-white/50 text-xl font-light tracking-widest animate-pulse">INITIALIZING CORE...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-[#050505] text-white overflow-hidden relative">
             <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#1a1a20] to-transparent pointer-events-none" />
             
             {/* Logo / Brand */}
             <div className="absolute top-10 flex flex-col items-center z-10">
                 <h1 className="text-3xl font-thin tracking-[0.3em] text-white/90">PIANO<span className="text-red-500 font-normal">+</span></h1>
                 <p className="text-xs text-white/30 tracking-widest mt-2 uppercase">Rust Audio Engine // Low Latency</p>
             </div>

             {/* Piano Container */}
             <div className="relative w-full max-w-[95vw] lg:max-w-6xl flex flex-col items-center">
                 
                 {/* Top Decor Line */}
                 <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent blur-[1px] mb-[-1px] z-20" />
                 
                 {/* Keys Container with Scroll */}
                 <div 
                    ref={scrollContainerRef}
                    className="piano-scroll w-full overflow-x-auto pb-12 pt-4 px-4 flex justify-start lg:justify-center"
                    style={{ scrollBehavior: 'smooth' }}
                 >
                     <div className="relative flex items-start flex-nowrap bg-[#111] p-1 pt-6 rounded-b-xl shadow-2xl ring-1 ring-white/5">
                        {/* Red Felt Strip */}
                        <div className="absolute top-0 left-0 right-0 h-4 bg-[#3a0a0a] shadow-[inset_0_2px_5px_rgba(0,0,0,1)] z-0 rounded-t-sm" />

                        {NOTES.map((note) => (
                            <Key
                                key={note.note}
                                label={note.key}
                                note={note.note}
                                type={note.type as "white" | "black"}
                                active={activeKeys.has(note.note)}
                                onMouseDown={() => playNote(note)}
                                onMouseUp={() => stopNote(note)}
                            />
                        ))}
                     </div>
                 </div>
             </div>
             
             <div className="absolute bottom-8 text-white/20 text-xs font-mono">
                 v1.0.1 • WASM ENABLED
             </div>
        </div>
    );
};
