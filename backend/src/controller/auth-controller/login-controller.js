const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user-schema');

const loginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userdata = {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(userdata, process.env.JWT_SECRET);

    res.status(200).json({
        token: token,      // Send the token in the response
        user: userdata    // Send user data as well
    });
};

module.exports = loginController;
