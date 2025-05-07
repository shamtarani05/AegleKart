const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user-schema');

const loginController = async (req, res) => {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

 
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET);

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Login successful' });
};

module.exports = loginController;