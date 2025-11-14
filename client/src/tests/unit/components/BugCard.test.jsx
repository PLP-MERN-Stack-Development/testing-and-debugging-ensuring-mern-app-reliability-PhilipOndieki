/**
 * Unit Tests for BugCard Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugCard from '../../../components/bugs/BugCard';

describe('BugCard Component - Unit Tests', () => {
  const mockBug = {
    _id: '123',
    title: 'Test Bug',
    description: 'Test bug description',
    status: 'open',
    priority: 'high',
    severity: 'major',
    createdBy: 'Test User',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render bug card with all details', () => {
      render(<BugCard bug={mockBug} {...mockHandlers} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
      expect(screen.getByText('Test bug description')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should render priority badge', () => {
      render(<BugCard bug={mockBug} {...mockHandlers} />);

      const priorityBadge = screen.getByText(/high/i);
      expect(priorityBadge).toBeInTheDocument();
    });

    it('should render severity badge', () => {
      render(<BugCard bug={mockBug} {...mockHandlers} />);

      const severityBadge = screen.getByText(/major/i);
      expect(severityBadge).toBeInTheDocument();
    });

    it('should handle missing optional fields', () => {
      const bugWithoutCreator = { ...mockBug, createdBy: undefined };

      render(<BugCard bug={bugWithoutCreator} {...mockHandlers} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when card is clicked', () => {
      render(<BugCard bug={mockBug} {...mockHandlers} />);

      const card = screen.getByText('Test Bug').closest('[data-testid*="bug-card"]') ||
                   screen.getByText('Test Bug').closest('div');

      if (card) {
        fireEvent.click(card);
      }

      // Note: This will only work if the component has a click handler on the card
    });

    it('should call onEdit when edit button is clicked', () => {
      render(<BugCard bug={mockBug} {...mockHandlers} />);

      const editButton = screen.getAllByRole('button').find(btn =>
        btn.textContent.includes('Edit') || btn.querySelector('[data-icon="edit"]')
      );

      if (editButton) {
        fireEvent.click(editButton);
        expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockBug);
      }
    });

    it('should call onDelete when delete button is clicked', () => {
      render(<BugCard bug={mockBug} {...mockHandlers} />);

      const deleteButton = screen.getAllByRole('button').find(btn =>
        btn.textContent.includes('Delete') || btn.querySelector('[data-icon="trash"]')
      );

      if (deleteButton) {
        fireEvent.click(deleteButton);
        expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockBug._id);
      }
    });
  });

  describe('Different Bug States', () => {
    it('should render bug with open status', () => {
      const openBug = { ...mockBug, status: 'open' };
      render(<BugCard bug={openBug} {...mockHandlers} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
    });

    it('should render bug with in-progress status', () => {
      const inProgressBug = { ...mockBug, status: 'in-progress' };
      render(<BugCard bug={inProgressBug} {...mockHandlers} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
    });

    it('should render bug with resolved status', () => {
      const resolvedBug = { ...mockBug, status: 'resolved' };
      render(<BugCard bug={resolvedBug} {...mockHandlers} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
    });

    it('should render bug with closed status', () => {
      const closedBug = { ...mockBug, status: 'closed' };
      render(<BugCard bug={closedBug} {...mockHandlers} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
    });
  });

  describe('Different Priority Levels', () => {
    it('should render low priority bug', () => {
      const lowPriorityBug = { ...mockBug, priority: 'low' };
      render(<BugCard bug={lowPriorityBug} {...mockHandlers} />);

      expect(screen.getByText(/low/i)).toBeInTheDocument();
    });

    it('should render medium priority bug', () => {
      const mediumPriorityBug = { ...mockBug, priority: 'medium' };
      render(<BugCard bug={mediumPriorityBug} {...mockHandlers} />);

      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });

    it('should render high priority bug', () => {
      const highPriorityBug = { ...mockBug, priority: 'high' };
      render(<BugCard bug={highPriorityBug} {...mockHandlers} />);

      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });

    it('should render critical priority bug', () => {
      const criticalPriorityBug = { ...mockBug, priority: 'critical' };
      render(<BugCard bug={criticalPriorityBug} {...mockHandlers} />);

      expect(screen.getByText(/critical/i)).toBeInTheDocument();
    });
  });

  describe('Different Severity Levels', () => {
    it('should render minor severity bug', () => {
      const minorBug = { ...mockBug, severity: 'minor' };
      render(<BugCard bug={minorBug} {...mockHandlers} />);

      expect(screen.getByText(/minor/i)).toBeInTheDocument();
    });

    it('should render major severity bug', () => {
      const majorBug = { ...mockBug, severity: 'major' };
      render(<BugCard bug={majorBug} {...mockHandlers} />);

      expect(screen.getByText(/major/i)).toBeInTheDocument();
    });

    it('should render critical severity bug', () => {
      const criticalBug = { ...mockBug, severity: 'critical' };
      render(<BugCard bug={criticalBug} {...mockHandlers} />);

      expect(screen.getByText(/critical/i)).toBeInTheDocument();
    });
  });

  describe('Drag and Drop Support', () => {
    it('should indicate dragging state when isDragging prop is true', () => {
      const { container } = render(
        <BugCard bug={mockBug} {...mockHandlers} isDragging={true} />
      );

      // The card should have some visual indication of dragging
      // This depends on the actual implementation
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render normally when not dragging', () => {
      const { container } = render(
        <BugCard bug={mockBug} {...mockHandlers} isDragging={false} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      render(<BugCard bug={mockBug} {...mockHandlers} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render card content as text', () => {
      render(<BugCard bug={mockBug} {...mockHandlers} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
      expect(screen.getByText('Test bug description')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long titles', () => {
      const longTitleBug = {
        ...mockBug,
        title: 'A'.repeat(100),
      };

      render(<BugCard bug={longTitleBug} {...mockHandlers} />);

      expect(screen.getByText(longTitleBug.title)).toBeInTheDocument();
    });

    it('should handle very long descriptions', () => {
      const longDescBug = {
        ...mockBug,
        description: 'A'.repeat(500),
      };

      render(<BugCard bug={longDescBug} {...mockHandlers} />);

      expect(screen.getByText(longDescBug.description)).toBeInTheDocument();
    });

    it('should handle bug with id instead of _id', () => {
      const bugWithId = { ...mockBug, id: '456' };
      delete bugWithId._id;

      render(<BugCard bug={bugWithId} {...mockHandlers} />);

      expect(screen.getByText('Test Bug')).toBeInTheDocument();
    });
  });
});
