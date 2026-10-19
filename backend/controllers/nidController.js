const User = require('../models/User');

// ==================== Submit NID ====================
exports.submitNid = async (req, res) => {
  try {
    const { nidNumber, nidDob } = req.body;
    
    let nidFrontImage, nidBackImage, nidSelfieImage;
    
    if (req.files) {
      if (req.files.nidFront && req.files.nidFront.length > 0) {
        nidFrontImage = `/uploads/${req.files.nidFront[0].filename}`;
      }
      if (req.files.nidBack && req.files.nidBack.length > 0) {
        nidBackImage = `/uploads/${req.files.nidBack[0].filename}`;
      }
      if (req.files.nidSelfie && req.files.nidSelfie.length > 0) {
        nidSelfieImage = `/uploads/${req.files.nidSelfie[0].filename}`;
      }
    }

    if (!nidNumber || !nidFrontImage || !nidBackImage || !nidSelfieImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'NID number, front, back, and selfie are required.' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.nidNumber = nidNumber;
    user.nidFrontImage = nidFrontImage;
    user.nidBackImage = nidBackImage;
    user.nidSelfieImage = nidSelfieImage;
    user.nidDob = nidDob;
    user.nidStatus = 'pending';
    
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'NID submitted successfully for verification.',
      user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Verify NID (Admin) ====================
exports.verifyNid = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.nidStatus = status;
    user.isNidVerified = status === 'verified';
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: `NID status updated to ${status}.`, 
      user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Get NID Status ====================
exports.getNidStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      nidStatus: user.nidStatus,
      isNidVerified: user.isNidVerified
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};