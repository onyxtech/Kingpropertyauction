import User from './user.model.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -refreshToken');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isActive: status === 'active' }, 
      { new: true }
    ).select('-password -refreshToken');
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user, message: `User ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update user profile (name, email, role)
export const updateUser = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.role) updates.role = req.body.role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password -refreshToken');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};