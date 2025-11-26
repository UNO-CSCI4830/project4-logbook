// app/login/__tests__/LoginPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock, // mock push so you can assert it was called
  }),
}));

import LoginPage from '../page';

describe('LoginPage', () => {
  // FIRST TEST
  // check if the login form renders correctly
  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go!/i })).toBeInTheDocument();
  });

  // SECOND TEST
  // check if an error shows on invalid credentials
  it('shows an error on invalid credentials', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false })
    ) as jest.Mock;

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'badpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Go!/i }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('Invalid credentials')
    );
  });

  // THIRD TEST
  // check if page changes correctly on valid credentials
  it('navigates to dashboard on valid credentials', async () => {
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: pushMock }),
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true })
    ) as jest.Mock;

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'keerthi@keerthi.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Go!/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/user'));
  });

  // FOURTH TEST
  // displays specific error for empty fields
  it('shows an error when submitting empty form', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /Go!/i }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('Please enter email and password')
    );
  });

});