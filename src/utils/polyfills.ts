
/**
 * Polyfills for Node.js globals in browser environments
 * This helps browser-compatibility with libraries that expect Node.js globals
 */

import { Buffer as BufferPolyfill } from 'buffer';

// Polyfill for 'global'
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  // @ts-ignore - Intentionally adding to window
  window.global = window;
}

// Polyfill for 'Buffer' if needed
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  // @ts-ignore - Intentionally adding to window
  window.Buffer = BufferPolyfill;
}

// Polyfill for process.env
if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
  // @ts-ignore - Intentionally adding to window
  window.process = { env: {} };
}

// Polyfill for stream (needed by Metaplex)
if (typeof window !== 'undefined' && typeof window.stream === 'undefined') {
  // @ts-ignore - Intentionally adding to window
  window.stream = {
    Readable: class ReadableStream {},
    PassThrough: class PassThroughStream {},
  };
}

// Polyfill for http (needed by Metaplex)
if (typeof window !== 'undefined' && typeof window.http === 'undefined') {
  // @ts-ignore - Intentionally adding to window
  window.http = {
    STATUS_CODES: {}
  };
}

// Polyfill for url (needed by Metaplex)
if (typeof window !== 'undefined' && typeof window.url === 'undefined') {
  // @ts-ignore - Intentionally adding to window
  window.url = {
    URL: URL,
    parse: () => ({}),
    format: () => ''
  };
}

export {};
