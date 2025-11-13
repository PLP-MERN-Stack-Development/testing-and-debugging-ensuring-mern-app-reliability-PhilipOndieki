/**
 * BugModal Component
 * Create/Edit bug modal with form
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import { bugSchema } from '../../utils/validators';
import { PRIORITY_OPTIONS, SEVERITY_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';

const BugModal = ({ isOpen, onClose, onSubmit, bug, loading }) => {
  const isEditing = !!bug;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(bugSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      priority: '',
      severity: '',
      status: 'open',
      createdBy: '',
    },
  });

  // Reset form when modal opens/closes or bug changes
  useEffect(() => {
    if (isOpen) {
      if (bug) {
        reset({
          title: bug.title || '',
          description: bug.description || '',
          priority: bug.priority || '',
          severity: bug.severity || '',
          status: bug.status || 'open',
          createdBy: bug.createdBy || '',
        });
      } else {
        reset({
          title: '',
          description: '',
          priority: '',
          severity: '',
          status: 'open',
          createdBy: '',
        });
      }
    }
  }, [isOpen, bug, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error is handled by the parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Bug' : 'Create New Bug'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          placeholder="Enter bug title"
          error={errors.title?.message}
          required
          {...register('title')}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Describe the bug in detail"
          rows={4}
          error={errors.description?.message}
          required
          {...register('description')}
        />

        {/* Priority and Severity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Priority"
            placeholder="Select priority"
            options={PRIORITY_OPTIONS}
            error={errors.priority?.message}
            required
            {...register('priority')}
          />

          <Select
            label="Severity"
            placeholder="Select severity"
            options={SEVERITY_OPTIONS}
            error={errors.severity?.message}
            required
            {...register('severity')}
          />
        </div>

        {/* Status (only for editing) */}
        {isEditing && (
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            {...register('status')}
          />
        )}

        {/* Created By */}
        <Input
          label="Your Name"
          placeholder="Enter your name"
          error={errors.createdBy?.message}
          required
          {...register('createdBy')}
        />

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || !isValid}
          >
            {isEditing ? 'Update Bug' : 'Create Bug'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

BugModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  bug: PropTypes.object,
  loading: PropTypes.bool,
};

export default BugModal;
