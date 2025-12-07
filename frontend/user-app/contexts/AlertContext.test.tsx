import { renderHook, act } from '@testing-library/react';
import { AlertProvider, useAlertRefresh } from './AlertContext';

describe('AlertContext', () => {
  it('should provide initial refresh trigger value of 0', () => {
    const { result } = renderHook(() => useAlertRefresh(), {
      wrapper: AlertProvider,
    });

    expect(result.current.refreshTrigger).toBe(0);
  });

  it('should increment refresh trigger when triggerRefresh is called', () => {
    const { result } = renderHook(() => useAlertRefresh(), {
      wrapper: AlertProvider,
    });

    act(() => {
      result.current.triggerRefresh();
    });

    expect(result.current.refreshTrigger).toBe(1);

    act(() => {
      result.current.triggerRefresh();
    });

    expect(result.current.refreshTrigger).toBe(2);
  });

  it('should throw error when used outside of AlertProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useAlertRefresh());
    }).toThrow('useAlertRefresh must be used within AlertProvider');

    consoleSpy.mockRestore();
  });
});
