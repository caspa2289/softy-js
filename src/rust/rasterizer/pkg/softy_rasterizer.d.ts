/* tslint:disable */
/* eslint-disable */
/**
* @param {string} value
*/
export function greet(value: string): void;
/**
* @param {any} raw_data
* @param {any} raw_projection_matrix
* @param {number} screen_width
* @param {number} screen_height
* @param {number} viewport_width
* @param {number} viewport_height
* @param {any} raw_camera_view_matrix
* @param {any} raw_camera_position
* @param {number} camera_z_near
*/
export function rasterize_frame(raw_data: any, raw_projection_matrix: any, screen_width: number, screen_height: number, viewport_width: number, viewport_height: number, raw_camera_view_matrix: any, raw_camera_position: any, camera_z_near: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly greet: (a: number, b: number) => void;
  readonly rasterize_frame: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
