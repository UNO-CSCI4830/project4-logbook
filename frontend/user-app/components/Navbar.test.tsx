import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar"; // change to your actual path

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

describe("Navbar", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders user info and logout button", () => {
    render(<Navbar />);

    // from your component
    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<Navbar />);

    // input with placeholder
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("navigates to /login when clicking logout", () => {
    render(<Navbar />);

    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(push).toHaveBeenCalledWith("/login");
  });
});
