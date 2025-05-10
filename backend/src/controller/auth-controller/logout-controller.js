 
const LogoutController = async (req, res) => {
    try {
        const token = req.cookies;
        console.log(token);

        res.clearCookie('token', {
            httpOnly: true,
            secure: false, 
            sameSite: 'None'
        });



        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = LogoutController;

