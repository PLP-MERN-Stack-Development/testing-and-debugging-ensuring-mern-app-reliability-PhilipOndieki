/**
 * Bug Controller
 * Business logic for bug operations
 */

const Bug = require('../models/Bug');
const logger = require('../config/logger');
const {
  successResponse,
  createdResponse,
  notFoundResponse,
  serverErrorResponse,
  paginatedResponse,
} = require('../utils/apiResponse');
const { NotFoundError, DatabaseError } = require('../middleware/errorHandler');
const { SUCCESS_MESSAGES, PAGINATION } = require('../config/constants');

/**
 * Create a new bug
 * @route POST /api/bugs
 */
const createBug = async (req, res, next) => {
  try {
    const bugData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      severity: req.body.severity,
      createdBy: req.body.createdBy,
    };

    // If user is authenticated, set creator field
    if (req.user) {
      bugData.creator = req.user._id;
      // Also set createdBy to user's name if not provided
      if (!bugData.createdBy) {
        bugData.createdBy = req.user.name;
      }
    }

    const bug = await Bug.create(bugData);

    logger.info(`Bug created: ${bug._id} by ${req.user ? req.user.email : 'anonymous'}`);
    return createdResponse(res, bug, SUCCESS_MESSAGES.BUG_CREATED);
  } catch (error) {
    logger.error(`Error creating bug: ${error.message}`);
    next(error);
  }
};

/**
 * Get all bugs with filtering, sorting, and pagination
 * @route GET /api/bugs
 */
const getAllBugs = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      severity,
      createdBy,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (severity) filter.severity = severity;
    if (createdBy) filter.createdBy = new RegExp(createdBy, 'i');

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), PAGINATION.MAX_LIMIT);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [bugs, total] = await Promise.all([
      Bug.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Bug.countDocuments(filter),
    ]);

    logger.info(`Retrieved ${bugs.length} bugs`);
    return paginatedResponse(res, bugs, pageNum, limitNum, total, SUCCESS_MESSAGES.BUGS_FOUND);
  } catch (error) {
    logger.error(`Error fetching bugs: ${error.message}`);
    next(error);
  }
};

/**
 * Get a single bug by ID
 * @route GET /api/bugs/:id
 */
const getBugById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bug = await Bug.findById(id).lean();

    if (!bug) {
      throw new NotFoundError(`Bug with ID ${id} not found`);
    }

    logger.info(`Retrieved bug: ${id}`);
    return successResponse(res, bug, SUCCESS_MESSAGES.BUG_FOUND);
  } catch (error) {
    logger.error(`Error fetching bug: ${error.message}`);
    next(error);
  }
};

/**
 * Update a bug
 * @route PUT /api/bugs/:id
 */
const updateBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      severity: req.body.severity,
      createdBy: req.body.createdBy,
    };

    // Remove undefined fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    const bug = await Bug.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!bug) {
      throw new NotFoundError(`Bug with ID ${id} not found`);
    }

    logger.info(`Bug updated: ${id}`);
    return successResponse(res, bug, SUCCESS_MESSAGES.BUG_UPDATED);
  } catch (error) {
    logger.error(`Error updating bug: ${error.message}`);
    next(error);
  }
};

/**
 * Partial update (status change)
 * @route PATCH /api/bugs/:id
 */
const patchBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bug = await Bug.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bug) {
      throw new NotFoundError(`Bug with ID ${id} not found`);
    }

    logger.info(`Bug status updated: ${id} -> ${status}`);
    return successResponse(res, bug, SUCCESS_MESSAGES.BUG_UPDATED);
  } catch (error) {
    logger.error(`Error patching bug: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a bug
 * @route DELETE /api/bugs/:id
 */
const deleteBug = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bug = await Bug.findByIdAndDelete(id);

    if (!bug) {
      throw new NotFoundError(`Bug with ID ${id} not found`);
    }

    logger.info(`Bug deleted: ${id}`);
    return successResponse(res, { id }, SUCCESS_MESSAGES.BUG_DELETED);
  } catch (error) {
    logger.error(`Error deleting bug: ${error.message}`);
    next(error);
  }
};

/**
 * Get bug statistics
 * @route GET /api/bugs/stats
 */
const getBugStats = async (req, res, next) => {
  try {
    const stats = await Bug.aggregate([
      {
        $facet: {
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          byPriority: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 },
              },
            },
          ],
          bySeverity: [
            {
              $group: {
                _id: '$severity',
                count: { $sum: 1 },
              },
            },
          ],
          total: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    const formattedStats = {
      total: stats[0].total[0]?.count || 0,
      byStatus: stats[0].byStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byPriority: stats[0].byPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      bySeverity: stats[0].bySeverity.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    logger.info('Bug statistics retrieved');
    return successResponse(res, formattedStats, 'Statistics retrieved successfully');
  } catch (error) {
    logger.error(`Error fetching bug statistics: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createBug,
  getAllBugs,
  getBugById,
  updateBug,
  patchBug,
  deleteBug,
  getBugStats,
};
