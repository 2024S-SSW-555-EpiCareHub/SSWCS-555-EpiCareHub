// Patients.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Patients from "../components/Patients"; // Adjust import path if needed
import { useNavigate as mockUseNavigate } from "./mockRouter"; // Import mock useNavigate

jest.mock("axios");

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Assign mock implementation to useNavigate
useNavigate.mockImplementation(mockUseNavigate);

describe("Patients Component", () => {
  beforeEach(() => {
    axios.request.mockResolvedValue({
      data: [{ id: 1, firstName: "John" }],
    });
  });

  it("fetches data and renders patients", async () => {
    render(<Patients />);
    await waitFor(() => expect(axios.request).toHaveBeenCalled());
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("renders patient data in DataTableComponent", async () => {
    render(<Patients />);
    await waitFor(() => expect(axios.request).toHaveBeenCalled());
    const patients = screen.getAllByRole("row");
    expect(patients.length).toBeGreaterThan(0);
  });

  it("opens patient form dialog when 'Add Patient' button is clicked", async () => {
    render(<Patients />);
    await waitFor(() => expect(axios.request).toHaveBeenCalled());
    const addButton = screen.getByText("Add Patient");
    fireEvent.click(addButton);
    const dialogTitle = screen.getByText("Add Patient", { selector: "div" });
    expect(dialogTitle).toBeInTheDocument();
  });

  it("shows confirmation dialog when 'Delete' button is clicked", async () => {
    render(<Patients />);
    await waitFor(() => expect(axios.request).toHaveBeenCalled());
    const deleteButton = screen.getByTestId("DeleteIcon"); // Replace "DeleteButton" with the actual data-testid attribute value
    fireEvent.click(deleteButton);
    const confirmationMessage = screen.getByText(/are you sure/i);
    expect(confirmationMessage).toBeInTheDocument();
  });

  it("handles file upload when 'Submit File' button is clicked", async () => {
    render(<Patients />);
    await waitFor(() => expect(axios.request).toHaveBeenCalled());
    const uploadButton = screen.getByTestId("FileUploadIcon");
    fireEvent.click(uploadButton);
    const submitButton = screen.getByText("Submit File");
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(screen.getByText("No file selected.")).toBeInTheDocument()
    );
  });

  it("displays edit patient form when 'Edit' button is clicked", async () => {
    render(<Patients />);
    await waitFor(() => expect(axios.request).toHaveBeenCalled());
    const editButton = screen.getByTestId("EditIcon");
    fireEvent.click(editButton);
    const formTitle = screen.getByText("Edit Patient", { selector: "div" });
    expect(formTitle).toBeInTheDocument();
  });
});
