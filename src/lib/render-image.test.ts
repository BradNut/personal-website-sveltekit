import type { Component } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { renderMock, satoriMock, toReactNodeMock, asPngMock, resvgCtorMock, devState } = vi.hoisted(() => ({
  renderMock: vi.fn(),
  satoriMock: vi.fn(),
  toReactNodeMock: vi.fn(),
  asPngMock: vi.fn(),
  resvgCtorMock: vi.fn(),
  devState: { dev: false },
}));

vi.mock('svelte/server', () => ({ render: renderMock }));
vi.mock('satori', () => ({ default: satoriMock }));
vi.mock('satori-html', () => ({ html: toReactNodeMock }));
vi.mock('@resvg/resvg-js', () => ({
  Resvg: class {
    constructor(...args: unknown[]) {
      resvgCtorMock(...args);
    }
    render() {
      return { asPng: asPngMock };
    }
  },
}));
vi.mock('#lib/fonts/FiraSans-SemiBold.ttf', () => ({ default: '/font.ttf' }));
vi.mock('$app/env', () => ({
  get dev() {
    return devState.dev;
  },
}));
vi.mock('$app/server', () => ({
  read: () => new Response(new Uint8Array([9, 9, 9])),
}));

import { componentToPng } from './render-image.ts';

const component = {} as Component;

beforeEach(() => {
  devState.dev = false;
  renderMock.mockReturnValue({ body: '<div>body</div>', head: '<title>t</title>' });
  toReactNodeMock.mockReturnValue({ type: 'div' });
  satoriMock.mockResolvedValue('<svg/>');
  asPngMock.mockReturnValue(new Uint8Array([1, 2, 3]));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('componentToPng', () => {
  it('renders the component to a PNG response', async () => {
    const response = await componentToPng(component, { header: 'Hi' }, 630, 1200);

    expect(renderMock).toHaveBeenCalledWith(component, { props: { header: 'Hi' } });
    expect(toReactNodeMock).toHaveBeenCalledWith('<div>body</div><title>t</title>');
    expect(satoriMock).toHaveBeenCalledWith(
      { type: 'div' },
      expect.objectContaining({ height: 630, width: 1200, fonts: [expect.objectContaining({ name: 'Fira Sans' })] }),
    );
    expect(resvgCtorMock).toHaveBeenCalledWith('<svg/>', { fitTo: { mode: 'width', value: 1200 } });
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(response.headers.get('cache-control')).toBe('public, immutable, no-transform, max-age=86400');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('does not write to the console', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    await componentToPng(component, {}, 630, 1200);

    expect(logSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(debugSpy).not.toHaveBeenCalled();
  });

  it('disables caching in dev', async () => {
    devState.dev = true;

    const response = await componentToPng(component, {}, 630, 1200);

    expect(response.headers.get('cache-control')).toBe('no-cache, no-store');
  });

  it('propagates satori failures', async () => {
    satoriMock.mockRejectedValueOnce(new Error('bad markup'));

    await expect(componentToPng(component, {}, 630, 1200)).rejects.toThrow('bad markup');
    expect(resvgCtorMock).not.toHaveBeenCalled();
  });
});
