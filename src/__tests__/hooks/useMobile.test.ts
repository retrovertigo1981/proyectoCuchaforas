import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMobile } from '@/hooks/useMobile';

describe('useMobile', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    matchMediaMock = vi.fn().mockImplementation((query: string) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    });

    window.matchMedia = matchMediaMock as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false when screen is wider than breakpoint', () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useMobile(768));

    expect(result.current).toBe(false);
  });

  it('should return true when screen is narrower than breakpoint', () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useMobile(768));

    expect(result.current).toBe(true);
  });

  it('should use default breakpoint of 768px', () => {
    renderHook(() => useMobile());

    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('should use custom breakpoint', () => {
    renderHook(() => useMobile(431));

    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 431px)');
  });

  it('should update when media query changes', () => {
    let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, handler: any) => {
        if (event === 'change') {
          changeHandler = handler;
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useMobile(768));

    expect(result.current).toBe(false);

    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerMock = vi.fn();

    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }));

    const { unmount } = renderHook(() => useMobile(768));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalled();
  });
});
