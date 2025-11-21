import React from "react";
import { render, screen } from "@testing-library/react";
import Menu from "@/components/Menu"; // adjust this path to where your Menu.tsx is

// Mock next/link for Jest
jest.mock("next/link", () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/image for Jest (simple passthrough)
jest.mock("next/image", () => {
  return ({ alt }: { alt: string }) => <img alt={alt} />;
});

describe("Menu", () => {
  it("renders the section titles", () => {
    render(<Menu />);

    // titles are in the component
    expect(screen.getByText("MENU")).toBeInTheDocument();
    expect(screen.getByText("OTHER")).toBeInTheDocument();
  });

  it("renders all visible menu items as links", () => {
    render(<Menu />);

    // these labels come from your array
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Applicances")).toBeInTheDocument(); // spelled like your component
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // you can also check that they're actually links
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
