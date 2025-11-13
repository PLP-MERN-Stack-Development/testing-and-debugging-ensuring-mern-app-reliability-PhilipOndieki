/**
 * Tests for Badge component
 */

import { render, screen } from '@testing-library/react';
import Badge from '../../../components/common/Badge';

describe('Badge', () => {
  test('renders badge with text', () => {
    render(<Badge variant="open" type="status">Open</Badge>);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  test('capitalizes variant when no children provided', () => {
    render(<Badge variant="open" type="status" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  test('renders status badge with correct colors', () => {
    render(<Badge variant="open" type="status">Open</Badge>);
    const badge = screen.getByText('Open');
    expect(badge.className).toContain('status-open');
  });

  test('renders priority badge with correct colors', () => {
    render(<Badge variant="high" type="priority">High</Badge>);
    const badge = screen.getByText('High');
    expect(badge.className).toContain('priority-high');
  });

  test('renders severity badge with correct colors', () => {
    render(<Badge variant="critical" type="severity">Critical</Badge>);
    const badge = screen.getByText('Critical');
    expect(badge.className).toContain('severity-critical');
  });

  test('renders with different sizes', () => {
    const { rerender } = render(<Badge variant="open" type="status" size="sm">Small</Badge>);
    expect(screen.getByText('Small').className).toContain('text-xs');

    rerender(<Badge variant="open" type="status" size="md">Medium</Badge>);
    expect(screen.getByText('Medium').className).toContain('text-sm');

    rerender(<Badge variant="open" type="status" size="lg">Large</Badge>);
    expect(screen.getByText('Large').className).toContain('text-base');
  });

  test('applies custom className', () => {
    render(<Badge variant="open" type="status" className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge.className).toContain('custom-class');
  });
});
