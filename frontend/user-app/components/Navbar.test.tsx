import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar"; // change to your actual path
import { AlertProvider } from "@/contexts/AlertContext";

// mock next/image
jest.mock("next/image", () => {
  return function MockedImage(props: any) {
    // you can return simple img to not break layout
    return <img alt={props.alt} />;
  };
});

// create a mock for useRouter
const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe("Navbar", () => {
  beforeEach(() => {
    push.mockClear();
  });

  const renderWithProvider = () => {
    return render(
      <AlertProvider>
        <Navbar />
      </AlertProvider>
    );
  };

  it("renders user info and logout button", () => {
    renderWithProvider();

    // from your component
    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("renders the search input", () => {
    renderWithProvider();

    // input with placeholder
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("navigates to /login when clicking logout", () => {
    renderWithProvider();

    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(push).toHaveBeenCalledWith("/login");
  });
});
