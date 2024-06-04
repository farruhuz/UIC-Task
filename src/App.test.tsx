import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import '@testing-library/jest-dom';


// Mock icons for testing (avoid actual rendering)
jest.mock('react-icons/fa', () => ({
  FaSquare: () => <div data-testid="fa-square" />,
  FaCheckSquare: () => <div data-testid="fa-check-square" />,
  FaMinusSquare: () => <div data-testid="fa-minus-square" />,
}));

jest.mock('react-icons/io', () => ({
  IoMdArrowDropright: () => <div data-testid="arrow" />,
}));

test('renders the tree structure with checkboxes and arrows', () => {
  render(<App />);

  // Check for folder names
  expect(screen.getByText('Fruits')).toBeInTheDocument();
  expect(screen.getByText('Drinks')).toBeInTheDocument();
  expect(screen.getByText('Vegetables')).toBeInTheDocument();

  // Check for arrow icons
  expect(screen.getAllByTestId('arrow')).toHaveLength(3); // One for each folder

  // Check for initial checkbox states (all unchecked)
  expect(screen.queryByTestId('fa-check-square')).toBeNull();
  expect(screen.queryByTestId('fa-minus-square')).toBeNull();
  expect(screen.getByTestId('fa-square')).toHaveLength(3); // One for each folder
});

test('expands/collapses folders on arrow click', () => {
  render(<App />);

  // Find the first folder's arrow
  const arrow = screen.getAllByTestId('arrow')[0];

  // Initially collapsed, expect sub-items not to be visible
  expect(screen.queryByText('Avocados')).toBeNull();

  // Click the arrow to expand
  fireEvent.click(arrow);

  // Now expect sub-items to be visible
  expect(screen.getByText('Avocados')).toBeInTheDocument();
  expect(screen.getByText('Bananas')).toBeInTheDocument();
});

test('selects/unselects folders with checkboxes', () => {
  render(<App />);

  // Find the first folder's checkbox
  const checkbox = screen.getAllByTestId('fa-square')[0];

  // Click to select
  userEvent.click(checkbox);

  // Expect checkmark icon
  expect(screen.getByTestId('fa-check-square')).toBeInTheDocument();

  // Click again to unselect
  userEvent.click(checkbox);

  // Expect square icon again
  expect(screen.getByTestId('fa-square')).toBeInTheDocument();
});

test('selects multiple folders with checkboxes', () => {
  render(<App />);

  // Find checkboxes for the first two folders
  const checkboxes = screen.getAllByTestId('fa-square').slice(0, 2);

  // Click both checkboxes
  userEvent.click(checkboxes[0]);
  userEvent.click(checkboxes[1]);

  // Expect checkmark icons for both folders
  expect(screen.getAllByTestId('fa-check-square')).toHaveLength(2);

  // Click the first checkbox again to deselect
  userEvent.click(checkboxes[0]);

  // Expect one checkmark and one square icon
  expect(screen.getAllByTestId('fa-check-square')).toHaveLength(1);
  expect(screen.getByTestId('fa-square')).toBeInTheDocument();
});

test('allows multi-selection of folders with checkboxes', () => {
  render(<App />);

  // Find checkboxes for the first two folders
  const checkboxes = screen.getAllByTestId('fa-square').slice(0, 2);

  // Click both checkboxes
  userEvent.click(checkboxes[0]);
  userEvent.click(checkboxes[1]);

  // Expect checkmark icons for both folders
  expect(screen.getAllByTestId('fa-check-square')).toHaveLength(2);

  // Click the first checkbox again to unselect
  userEvent.click(checkboxes[0]);

  // Expect only the second folder to be selected (FaMinusSquare)
  expect(screen.getByTestId('fa-minus-square')).toBeInTheDocument();
  expect(screen.getByTestId('fa-check-square')).toHaveLength(1);
});
// Add more tests for multi-selection, propagation, etc. based on your App's features
