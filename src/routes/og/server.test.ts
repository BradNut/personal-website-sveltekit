import { beforeEach, describe, expect, it, vi } from 'vitest';

const componentToPngMock = vi.fn();

vi.mock('$lib/renderImage', () => ({
  componentToPng: (...args: unknown[]) => componentToPngMock(...args),
}));

vi.mock('$lib/components/socialImageCard.svelte', () => ({ default: {} }));

import { GET } from './+server.js';

function makeEvent(params: Record<string, string> = {}): Parameters<typeof GET>[0] {
  const url = new URL('http://localhost/og');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return { url } as Parameters<typeof GET>[0];
}

beforeEach(() => {
  componentToPngMock.mockReset();
});

describe('GET /og', () => {
  it('calls componentToPng with all params', async () => {
    const fakeResponse = new Response('png-data');
    componentToPngMock.mockReturnValueOnce(fakeResponse);

    const event = makeEvent({ header: 'My Header', page: 'Home', content: 'Some content' });
    const result = await GET(event);

    expect(result).toBe(fakeResponse);
    expect(componentToPngMock).toHaveBeenCalledOnce();

    const [, props, h, w] = componentToPngMock.mock.calls[0];
    expect(props.header).toBe('My Header');
    expect(props.page).toBe('Home');
    expect(props.content).toBe('Some content');
    expect(props.image).toBe('http://localhost/b_shell_nut_favicon.png');
    expect(props.width).toBe('1200');
    expect(props.height).toBe('630');
    expect(props.url).toBe('http://localhost/');
    expect(h).toBe(630);
    expect(w).toBe(1200);
  });

  it('defaults missing optional params', async () => {
    componentToPngMock.mockReturnValueOnce(new Response('png'));

    const event = makeEvent({ content: 'Only content' });
    await GET(event);

    const [, props] = componentToPngMock.mock.calls[0];
    expect(props.header).toBeUndefined();
    expect(props.page).toBeUndefined();
    expect(props.content).toBe('Only content');
  });

  it('defaults content to empty string when missing', async () => {
    componentToPngMock.mockReturnValueOnce(new Response('png'));

    const event = makeEvent();
    await GET(event);

    const [, props] = componentToPngMock.mock.calls[0];
    expect(props.content).toBe('');
  });

  it('returns undefined when componentToPng throws', async () => {
    componentToPngMock.mockImplementationOnce(() => {
      throw new Error('render failed');
    });

    const event = makeEvent({ header: 'test' });
    const result = await GET(event);

    expect(result).toBeUndefined();
  });
});
