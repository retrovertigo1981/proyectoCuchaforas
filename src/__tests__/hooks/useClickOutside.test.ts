import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

describe('useClickOutside', () => {
  let container: HTMLDivElement;
  let outsideElement: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    outsideElement = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(outsideElement);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(outsideElement);
    vi.restoreAllMocks();
  });

  it('should call callback when clicking outside the element', () => {
    const callback = vi.fn();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useClickOutside(ref, callback);
    });

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    outsideElement.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should NOT call callback when clicking inside the element', () => {
    const callback = vi.fn();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useClickOutside(ref, callback);
    });

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    container.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback on touchstart outside the element', () => {
    const callback = vi.fn();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useClickOutside(ref, callback);
    });

    const event = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
    });

    outsideElement.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should NOT call callback on touchstart inside the element', () => {
    const callback = vi.fn();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useClickOutside(ref, callback);
    });

    const event = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
    });

    container.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should clean up event listeners on unmount', () => {
    const callback = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(container);
      useClickOutside(ref, callback);
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  it('should handle null ref gracefully', () => {
    const callback = vi.fn();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, callback);
    });

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    outsideElement.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
